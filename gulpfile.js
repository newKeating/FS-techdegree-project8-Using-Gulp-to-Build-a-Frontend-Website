"use strict";

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const maps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const gulpSequence = require('gulp-sequence');
const connect = require('gulp-connect');

gulp.task("concatScripts", () => {
  return gulp.src(['js/**/*.js'])
  .pipe(maps.init())
  .pipe(concat('all.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

gulp.task("scripts", ["concatScripts"], () => {
  return gulp.src("js/all.js")
  .pipe(uglify())
  .pipe(rename('all.min.js'))
  .pipe(gulp.dest('dist/scripts'))
  .pipe(connect.reload());
});

gulp.task("compileSass", () => {
  return gulp.src("sass/global.scss")
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'));
});

gulp.task("styles",["compileSass"], () => {
  return gulp.src("css/global.css")
  .pipe(cleanCSS())
  .pipe(rename("all.min.css"))
  .pipe(gulp.dest('dist/styles'))
  .pipe(connect.reload());
});

gulp.task('images', () => {
  return gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', () => {
  return gulp.src('dist', {read: false})
      .pipe(clean());
});

gulp.task('watchFiles', () => {
  gulp.watch(['sass/**'], ['styles'])
  gulp.watch('js/**', ['scripts'])
});

gulp.task('serve', ['watchFiles'], () => {
  connect.server({
    port: 3000,
    livereload: true
  });
});

gulp.task('build',gulpSequence(['clean'], 'scripts', 'styles', 'images', 'watchFiles'));

gulp.task('default', ['build'], () => {
	gulp.start('serve');
})
