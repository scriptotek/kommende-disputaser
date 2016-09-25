const gulp = require('gulp');
const sass = require('gulp-sass');
const bs = require('browser-sync').create();
const cachebust = require('gulp-cache-bust');
const rev = require('gulp-rev-append');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

const paths = {
    index: 'index.html',
    sass: {
        src: './src/*.scss',
        dest: './build',
    },
    js: {
        src: 'src/*.js',
        dest: './build',
    }
}

gulp.task('styles', () =>
    gulp.src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(bs.stream())
)

gulp.task('scripts', () =>
    gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dest))
)

gulp.task('browser-sync-init', () =>
    bs.init({
        server: { baseDir: './' }
    })
)

gulp.task('build', ['styles', 'scripts'], () =>
    gulp.src('./index.html')
        .pipe(rev())
        .pipe(gulp.dest('.'))
)

gulp.task('serve', ['browser-sync-init'], () => {
    gulp.watch(paths.sass.src, ['styles', bs.reload])
    gulp.watch(paths.js.src, ['scripts', bs.reload])
    gulp.watch(paths.index).on('change', bs.reload)
})

gulp.task('default', ['serve'])
