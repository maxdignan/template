var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./app/client/scss/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./output/css'))
    .pipe(livereload());
});

gulp.task('sasswatch', function() {
  gulp.watch('./public/client/scss/*.scss', ['sass']);
});

gulp.task('htmlMove', function () {
  gulp.src('./app/client/*.html')
    .pipe(gulp.dest('./output'))
    .pipe(livereload());
});

gulp.task('htmlwatch', function() {
  gulp.watch('./public/client/*.html', ['htmlMove']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js handlebars coffee',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'sasswatch',
  'htmlMove',
  'htmlwatch'
]);
