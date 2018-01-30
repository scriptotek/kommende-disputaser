# kommende-disputaser

Enkel infoskjerm for å vise kommende disputaser.

[![Take 2](disputaser.jpg)](disputaser.jpg)
@[020f978](https://github.com/scriptotek/kommende-disputaser/commit/020f978cc49302b95c7fd3e2378fa7eadda7cf6b)


## Oppsett

1. Installer avhengigheter med `npm install`
2. Start utviklingsserver med `node_modules/.bin/gulp`. Denne bygger `build/mn.html` og `build/med.html` fra `src/index.html`, kompilerer SASS (`src/app.sass`) til CSS (`build/app.css`) og bygger JavaScript (`src/app.js` -> `build/app.js`).
