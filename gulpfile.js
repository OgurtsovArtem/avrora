const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const changed = require('gulp-changed');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');

const isDev = process.env.NODE_ENV !== 'production';

function clean() {
  return del('dist');
}

function views() {
  return gulp.src('src/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'));
}

function styles() {
  return gulp.src('src/styles/*.scss')
    .pipe(plumber())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass.sync({ outputStyle: 'expanded' }))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulpIf(!isDev, cssnano()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/css/'));
}

function scripts() {
  return gulp.src('src/scripts/*.js')
    .pipe(plumber())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/js/'));
}

function icons() {
  return gulp.src('src/icons/*.svg')
    .pipe(plumber())  
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '',
          sprite: 'sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest('dist/assets/icons/'));
}

function public() {
  return gulp.src('public/**/*')
    .pipe(changed('dist'))
    .pipe(gulp.dest('dist'));
}

function serve() {
  browserSync({ server: './dist', startPath: '/' });
  gulp.watch('src/**/*.pug', gulp.series(views, reload));
  gulp.watch('src/**/*.scss', gulp.series(styles, reload));
  gulp.watch('src/**/*.js', gulp.series(scripts, reload));
  gulp.watch('src/icons/*.svg', gulp.series(icons, reload));
  gulp.watch('public/**/*', gulp.series(public, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

const build = gulp.series(clean, gulp.parallel(views, styles, scripts, icons, public));

exports.build = build;
exports.default = gulp.series(build, serve);
