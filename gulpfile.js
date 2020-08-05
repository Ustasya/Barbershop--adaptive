var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var images = require('gulp-imagemin');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');
var uglify = require('gulp-uglify');



gulp.task('style', function () {
  return gulp.src('source/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(
      postcss([
        require('css-mqpacker')({sort: true}),
        require('autoprefixer')()
      ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.reload({stream:true}));
});


gulp.task('images', function () {
  return gulp.src('img/**/*.{png,svg}')
    .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
      imagenin.svgo()
    ]))
    .pipe(gulp.dest('img'));
});


gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'))
    .pipe(server.reload({stream:true}));
});

gulp.task('clean', function () {
  return del('build')
})

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/js/**',
    'source/img/**',
    'source/css/**'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});



gulp.task('serve', function () {
  server.init({
    server: 'build/'
  });

  gulp.watch('source/less/**/*.less', gulp.parallel('style'));
gulp.watch('source/*.html', gulp.parallel('html'));
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  gulp.parallel(
    'style',
    'html'
  )
));
