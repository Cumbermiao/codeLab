const gulp = require("gulp");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const copy = require("gulp-copy");

gulp.task("babel", () => {
  gulp.watch("src/nodeuii/**/*.js", () => {
   return gulp
      .src("src/nodeuii/**/*.js")
      .pipe(
        babel({
          babelrc: false,
          plugins: [
            "transform-es2015-modules-commonjs",
            ["@babel/plugin-proposal-decorators", { legacy: true }]
          ]
        })
      )
      .pipe(gulp.dest("dist"));
  });
});

gulp.task("copy", () => {
  return gulp.src("./src/webapp/**/*.vue").pipe(copy("dist", { prefix: 2 }));
});

gulp.task("gulp:dev", () => {
  gulp.watch("./src/nodeuii/**/*.js", () => {
    return gulp
      .src("./src/nodeuii/**/*.js")
      .pipe(
        babel({
          babelrc: false,
          plugins: ["transform-es2015-modules-commonjs"]
        })
      )
      .pipe(gulp.dest("dist"));
  });
});

gulp.task("app", () => {
  return gulp
    .src("src/nodeuii/routes/*.js")
    .pipe(
      babel({
        babelrc: false,
        plugins: ["transform-es2015-modules-commonjs"]
      })
    )
    .pipe(gulp.dest("dist"));
});
gulp.task("conf", () => {
  return gulp
    .src("./src/nodeuii/**/*.js")
    .pipe(
      babel({
        // babelrc:false,
        plugins: ["transform-es2015-modules-commonjs"]
      })
    )
    .pipe(gulp.dest("./dist"));
});
gulp.task("default", ["babel"]);
