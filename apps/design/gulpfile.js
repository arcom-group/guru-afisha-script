'use strict';

let del                 = require('del'),
    gulp                = require('gulp'),
    pug                 = require('gulp-pug'),
    sass                = require('gulp-sass'),
    concat              = require('gulp-concat'),
    rename              = require('gulp-rename'),
    plumber             = require('gulp-plumber'),
    browserSync         = require('browser-sync'),
    imagemin            = require('gulp-imagemin'),
    autoprefixer        = require('gulp-autoprefixer')

let paths = {
  dirs: {
    build: './build',
  },
  html: {
    src: './src/pages/*.pug',
    dest: './build',
    watch: [
      './src/pages/*.pug',
      './src/templates/*.pug',
      './src/blocks/**/*.pug',
    ],
  },
  css: {
        src: './src/styles/style.scss',
        dest: './build/',
        watch: [
            './src/blocks/**/*.scss',
            './src/styles/**/*.scss',
            './src/styles/*.scss',
        ],
  },
  js: {
    src: [
        './src/scripts/plugins/**/*.js',
        './src/blocks/**/*.js',
    ],
    dest: './build/js',
    watch: './src/blocks/**/*.js',
    watchPlugins: './src/scripts/plugins/**/*.js',
  },
  images: {
    src: './src/blocks/**/images/*',
    dest: './build/img',
    watch: ['./src/blocks/**/images/*'],
  },
  svg: {
      src: './src/svg/**/*.svg',
      dest: './build/img',
      watch: ['./src/svg/**/*.svg'],
  },
  png: {
      src: './src/png/**/*.png',
      dest: './build/img',
      watch: ['./src/png/**/*.png'],
  },
  fonts: {
    src: './src/fonts/*',
    dest: './build/fonts',
    watch: './src/fonts/*',
  }
};

gulp.task('clean', function () {
    return del(paths.dirs.build);
});

gulp.task('templates', function () {
    return gulp.src(paths.html.src)
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

gulp.task('styles', function () {
    return gulp.src(paths.css.src)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 20 versions'],
        }))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

gulp.task('scripts', function () {
    return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('images', function () {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(rename({
            dirname: '',
        }))
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('svg', function () {
    return gulp.src(paths.svg.src)
        .pipe(plumber())
        .pipe(rename({
            dirname: '',
        }))
        .pipe(gulp.dest(paths.svg.dest));
});

gulp.task('png', function () {
    return gulp.src(paths.png.src)
        .pipe(plumber())
        .pipe(rename({
            dirname: '',
        }))
        .pipe(gulp.dest(paths.png.dest));
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

gulp.task('server', function () {
    (browserSync.init({
        server: {
            baseDir: paths.dirs.build,
        },
        reloadOnRestart: true,
    }))
    gulp.watch(paths.html.watch, gulp.parallel('templates'));
    gulp.watch(paths.css.watch, gulp.parallel('styles'));
    gulp.watch(paths.js.watch, gulp.parallel('scripts'));
    gulp.watch(paths.js.watchPlugins, gulp.parallel('scripts'));
    gulp.watch(paths.images.watch, gulp.parallel('images'));
    gulp.watch(paths.svg.watch, gulp.parallel('svg'));
    gulp.watch(paths.svg.watch, gulp.parallel('png'));
    gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});

gulp.task('build', gulp.series('clean', 'templates', 'styles', 'scripts', 'images', 'svg', 'png', 'fonts'));

gulp.task('dev', gulp.series('build', 'server'));

gulp.task('default', gulp.series('dev'));

// gulp.task('command', callback);


// SASS Paths
// const sassPaths = ['./node_modules'];
// Demo Sass // Task compile sass and use postcss
// gulp.task('sass', function () {
//     return gulp.src(sassFiles)
//         .pipe(glob())
//         .pipe(sass({includePaths: sassPaths}))
//         .pipe(sass().on('error', sass.logError))
//         .pipe(sourceMaps.write('maps'))
//         .pipe(gulp.dest(buildFolder + '/css'))
// });
