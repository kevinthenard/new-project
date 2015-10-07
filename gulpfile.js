var gulp        = require('gulp');
var watch       = require('gulp-watch');
var sass        = require('gulp-sass');
var webserver   = require('gulp-webserver');
var jade        = require('gulp-jade');
var browserify  = require('gulp-browserify');
var notify      = require('gulp-notify');
var plumber     = require('gulp-plumber');
var iconfont    = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

gulp.task('connect', function() {
  gulp.src('./dist')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('html', function () {
  gulp.src(['./templates/*.jade', './templates/advantages/*.jade'])
    .pipe(plumber({errorHandler: notify.onError("Error with jade : <%= error.message %>")}))
    .pipe(jade())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', function () {
  gulp.src('./assets/sass/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error with sass : <%= error.message %>")}))
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function () {
  gulp.src('./assets/js/app.js')
    .pipe(plumber({errorHandler: notify.onError("Error with js : <%= error.message %>")}))
    .pipe(browserify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('images', function () {
  gulp.src('./assets/images/**/*')
    .pipe(plumber({errorHandler: notify.onError("Error with images : <%= error.message %>")}))
    .pipe(gulp.dest('./dist/images/'));
});

gulp.task('icons', function() {
  gulp.src('./assets/icons/**/*')
    .pipe(plumber({errorHandler: notify.onError("Error with icons : <%= error.message %>")}))
    .pipe(iconfontCss({
      fontName: 'icons',
      targetPath: '../../dist/css/icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: 'icons',
      normalize: true
    }))
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', function() {
  watch('./scss/**/*.scss', function () {
    gulp.start('sass');
  });
  watch('./_img/**/*', function () {
    gulp.start('images');
  });
  watch('./_img/icons/**/*', function () {
    gulp.start('icons');
  });
  watch('./templates/**/*.jade', function () {
    gulp.start('html');
  });
  watch('./js/**/*.js', function () {
    gulp.start('js');
  });
});

gulp.task('build', ['html', 'sass', 'js', 'images', 'icons']);

gulp.task('default', ['connect', 'build', 'watch']);