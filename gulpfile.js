const browserSync = require("browser-sync");
const del = require("del");
const gulp = require("gulp");
const changed = require("gulp-changed");
const cssnano = require("gulp-cssnano");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const svgSprite = require("gulp-svg-sprite");
const uglify = require("gulp-uglify");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const imagemin = require("gulp-imagemin");
const webpack = require("webpack-stream");

const isDev = process.env.NODE_ENV !== "production";

function clean() {
  return del("dist");
}

function views() {
  return gulp
    .src("src/pages/*.pug")
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("dist"));
}

function styles() {
  return gulp
    .src("src/styles/*.scss")
    .pipe(plumber())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass.sync({ outputStyle: "expanded" }))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulpIf(!isDev, cssnano()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/assets/css/"));
}

// function scripts() {
//   return gulp
//     .src("src/scripts/*.js")
//     .pipe(plumber())
//     .pipe(gulpIf(isDev, sourcemaps.init()))
//     .pipe(gulpIf(isDev, sourcemaps.write()))
//     .pipe(gulpIf(!isDev, uglify()))
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(gulp.dest("dist/assets/js/"));
// }

function scripts() {
  return gulp
    .src("src/scripts/*.js")
    .pipe(
      webpack({
        config: require("./webpack.config.js"),
      })
    )
    .pipe(gulp.dest("dist/assets/js/"));
}

function vendorJs() {
  const modules = [
    "node_modules/swiper/swiper-bundle.min.js",
    "node_modules/swiper/swiper-bundle.min.js.map",
    "node_modules/masonry-layout/dist/masonry.pkgd.min.js",
  ];

  return gulp.src(modules).pipe(gulp.dest("dist/assets/libs/js"));
}

function vendorCss() {
  const modules = ["node_modules/swiper/swiper-bundle.min.css"];

  return gulp.src(modules).pipe(gulp.dest("dist/assets/libs/style/"));
}

function icons() {
  return gulp
    .src("src/icons/*.svg")
    .pipe(plumber())
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: "",
            sprite: "sprite.svg",
          },
        },
      })
    )
    .pipe(gulp.dest("dist/assets/icons/"));
}
function images() {
  return gulp
    .src("src/images/**/*.+(png|jpg|gif|ico|svg|webp|jpeg)")
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 5, // 0 to 7
      })
    )
    .pipe(gulp.dest("dist/assets/images/"));
}

function fonts() {
  gulp
    .src("src/fonts/*.ttf")
    .pipe(ttf2woff())
    .pipe(gulp.dest("dist/assets/fonts/"));
  return gulp
    .src("src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("dist/assets/fonts/"));
}

function public() {
  return gulp.src("public/**/*").pipe(changed("dist")).pipe(gulp.dest("dist"));
}

function serve() {
  browserSync({ server: "./dist", startPath: "/" });
  gulp.watch("src/**/*.pug", gulp.series(views, reload));
  gulp.watch("src/**/*.scss", gulp.series(styles, reload));
  gulp.watch("src/**/*.js", gulp.series(scripts, reload));
  gulp.watch("src/icons/*.svg", gulp.series(icons, reload));
  gulp.watch(
    "src/images/**/*.+(png|jpg|gif|ico|svg|webp|jpeg)",
    gulp.series(images, reload)
  );
  gulp.watch("src/fonts/*.ttf", gulp.series(fonts, reload));
  gulp.watch("public/**/*", gulp.series(public, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

const build = gulp.series(
  clean,
  gulp.parallel(
    views,
    styles,
    scripts,
    icons,
    images,
    vendorJs,
    vendorCss,
    fonts,
    public
  )
);

exports.build = build;
exports.default = gulp.series(build, serve);
