var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('default', function() {
  var log = console['log'];
  log('Usage:');
  log('gulp lint: check js files');
  log('gulp webserver: starts an web server');
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.js').
      pipe(gjslint()).
      pipe(gjslint.reporter('console'), {fail: true});
});

gulp.task('webserver', function() {
  gulp.src('.').pipe(webserver({
    livereload: true
  }));
});
