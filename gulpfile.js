const gulp = require('gulp');
const sass = require('gulp-sass');
const bs = require('browser-sync').create();
const rev = require('gulp-rev-append');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const replace = require('gulp-replace')
const rename = require('gulp-rename')

const feeds = [
    {
        prefix: 'mn',
        title: 'Kommende disputaser MN',
        feedUrl: 'http://www.mn.uio.no/forskning/aktuelt/arrangementer/disputaser/?vrtx=feed&view=allupcoming',
        logo: 'assets/UiO_MN_Seal_C_ENG_cmyk.png',
        customCss: 'mn.css',
    },
    {
        prefix: 'med',
        title: 'Kommende disputaser MED',
        feedUrl: 'http://www.med.uio.no/forskning/aktuelt/arrangementer/disputaser/?vrtx=feed&view=allupcoming',
        logo: 'assets/UiO_MED_Seal_C_ENG_cmyk.png',
        customCss: 'med.css',
    }
]

const paths = {
    index: './src/index.html',
    sass: {
        src: './src/*.scss',
        dest: './build',
    },
    js: {
        src: 'src/*.js',
        dest: './build',
    },
    assets: ['./src/assets/*.png'],
}

gulp.task('assets', () =>
    gulp.src(paths.assets)
        .pipe(gulp.dest('./build/assets/'))
)

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
        server: { baseDir: './build/' }
    })
)

gulp.task('build', ['styles', 'scripts', 'assets'], () =>
    feeds.forEach(function(config) {
        gulp.src(paths.index)
            .pipe(replace(/%%([a-zA-Z]+)%%/g, function(m, s) {
                console.log(m, '--', s);
                return config[s] || m;
            }))
            .pipe(replace(/%logo%/, config.logo))
            .pipe(replace(/%feedUrl%/, config.feedUrl))
            .pipe(rev())
            .pipe(rename(`${config.prefix}.html`))
            .pipe(gulp.dest(`./build/`));
    })
)

gulp.task('serve', ['browser-sync-init', 'build'], () => {
    gulp.watch(paths.sass.src, ['styles', bs.reload])
    gulp.watch(paths.js.src, ['scripts', bs.reload])
    gulp.watch(paths.index, ['build', bs.reload])
})

gulp.task('default', ['serve'])
