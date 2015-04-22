var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('default', function() {
  var log = console['log'];
  log('Usage:');
  log('gulp debug: starts an web server');
});

gulp.task('debug', function() {
  gulp.src('.').pipe(webserver({
    livereload: true
  }));
});
