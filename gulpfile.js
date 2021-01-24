const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())  // Находит ошибки
    .pipe(sourcemap.init()) // Записывает состояние sass файла
    .pipe(sass()) // sass превращается в css
    .pipe(postcss([ // postcss вмещает в себя подплагины
      autoprefixer(), // в css появились префиксы
      csso() // css появилась минификация
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css")) // меняем название файла
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const stylesСss = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())  // Находит ошибки
    .pipe(sourcemap.init()) // Записывает состояние sass файла
    .pipe(sass()) // sass превращается в css
    .pipe(postcss([ // postcss вмещает в себя подплагины
      autoprefixer(), // в css появились префиксы
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.css")) // меняем название файла
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.stylesСss = stylesСss;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
}

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    //.pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream())
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp.src ([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}"
  ],
  {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/**/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series(html)).on("change", sync.reload);
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    stylesСss,
    html,
    scripts,
    sprite,
    copy,
    images,
    createWebp
  )
)

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    stylesСss,
    html,
    scripts,
    sprite,
    copy,
    createWebp
  ),
  gulp.series(
    server, watcher
  )
);
