'use strict';

function stripHTML(dirtyString) {
  var container = document.createElement('div');
  var text = document.createTextNode(dirtyString);
  container.appendChild(text);
  return container.innerHTML; // innerHTML will be a xss safe string
}

function loadFeed(url, $main) {

  function getViewData(entry) {
    // Extracts and transforms data from an RSS entry
    var dt = new Date(entry['v:event-start']['#']);
    var dtstr = dt.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ', ' + dt.toLocaleTimeString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    var summary = entry['summary'].replace(/(<([^>]+)>)/ig, "").trim();

    if (summary.indexOf(':') != -1) {
      var summarysplit = [summary.substr(0, summary.indexOf(':')).replace(/["\s]+$/, '').replace(/^["\s]+/, ''), summary.substr(summary.indexOf(':') + 1).replace(/["\s]+$/, '').replace(/^["\s]+/, '')];
    } else {
      var summarysplit = [summary, ''];
    }

    var titleWordCount = summarysplit[1].split(' ').length;
    var titleClass = 'default';
    if (titleWordCount > 30) {
      titleClass = 'wc30';
    } else if (titleWordCount > 20) {
      titleClass = 'wc20';
    }

    var image = null;
    if (entry['v:image'] !== undefined && entry['v:image']['#'] !== undefined) {
      image = entry['v:image']['#'];
    }

    return {
      image: image,
      person: entry['title'].replace(/D[a-z]+: /, ''),
      location: entry['v:event-location']['#'],
      time: dtstr,
      intro: summarysplit[0],
      title: summarysplit[1],
      titleClass: titleClass
    };
  }

  feednami.load(url, function (res) {
    var entries = res.feed.entries;

    entries.forEach(function (entry) {
      if (entry.title.indexOf('PR:') == -1) {
        var view = getViewData(entry);
        console.log(view);
        var tplFn = doT.template($('#entry_template').html());
        var $entry = $(tplFn(view));
        $main.append($entry);
      }
    });

    if (entries.length) {
      Show.start($('.entry'), $('#cardno'));
    } else {
      $('#cardno').html('');
      var tplFn = doT.template($('#empty_template').html());
      var $entry = $(tplFn());
      $main.append($entry);
    }
  });
};

/* Navigation module */
var Show = function () {

  var my = {
    $cards: null,
    $status: null
  },
      currentCard = -1,
      size = 0,
      timer;

  function showCard(n) {
    if (my.$status) {
      my.$status.html(n + 1 + ' / ' + size);
    }
    currentCard = n;
    for (var i = size - 1; i >= 0; i--) {
      if (i == currentCard) {
        $(my.$cards[i]).show();
      } else {
        $(my.$cards[i]).hide();
      }
    }
  }

  function nextCard() {
    showCard(currentCard > size - 2 ? 0 : currentCard + 1);
  }

  function prevCard() {
    showCard(currentCard == 0 ? size - 1 : currentCard - 1);
  }

  $(window).keydown(function (e) {
    /**
     * Arrow keys: navigate through the cards and stop the timer so we can debug stuff
     * Space key: jump to next slide and resume the timer.
     */
    if (e.keyCode === 0 || e.keyCode === 32) {
      // Space
      e.preventDefault();
      tick();
    } else if (e.keyCode === 39 || e.keyCode === 40) {
      // Down or right key
      my.stop();
      e.preventDefault();
      nextCard();
    } else if (e.keyCode === 37 || e.keyCode === 38) {
      // Up or left key
      my.stop();
      e.preventDefault();
      prevCard();
    }
  });

  function tick() {
    my.stop();
    nextCard();
    timer = setTimeout(tick, 8000); // Wait 8 seconds
  }

  my.start = function ($cards, $status) {
    if ($cards) {
      my.$cards = $cards;
      size = my.$cards.length;
    }
    if ($status) {
      my.$status = $status;
    }
    tick();
  };

  my.stop = function () {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return my;
}();

/* Reload the browser if the page is updated (on git pull) */
(function watch() {

  var prev = null,
      timer = null,
      interval = 5 * 60 * 1000;

  function tick() {
    $.ajax({
      type: 'HEAD',
      url: 'index.html'
    }).done(function (message, text, jqXHR) {
      var current = jqXHR.getResponseHeader('Content-Length');
      if (!prev) {
        prev = current;
      } else if (current > 0 && prev != current) {
        timer.stop();
        setTimeout(function () {
          // Short break to be really sure that we don't reload while write is in progress
          window.location.replace('./?ts=' + current);
        }, 500);
      }
      timer = setTimeout(tick, interval);
    }).fail(function () {
      console.log('no network');
      timer = setTimeout(tick, interval);
    });
  }

  timer = setTimeout(tick, interval);
})();
//# sourceMappingURL=app.js.map
