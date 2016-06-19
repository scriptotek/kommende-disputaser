'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var cachebust = require('gulp-cache-bust');
var rev = require('gulp-rev-append');

var paths = {
    index: 'index.html',
    sass: {
        src: './scss/*.scss',
        dest: './build',
    }
}

gulp.task('styles', function() {
    return gulp.src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(bs.stream());
});

gulp.task('browser-sync-init', function() {
    bs.init({
        server: { baseDir: './' }
    });
});

gulp.task('build', ['styles'], function() {
  return gulp.src('./index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

gulp.task('serve', ['browser-sync-init'], function() {
    gulp.watch(paths.sass.src, ['styles']); // , bs.reload({stream:true})]);
    gulp.watch(paths.index).on('change', bs.reload);
});

gulp.task('default', ['serve']);
