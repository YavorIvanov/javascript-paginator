// requirements
var gulp        = require("gulp");
var sass        = require("gulp-sass");
var del         = require("del");
var runSequence = require("run-sequence");
var browserSync = require("browser-sync").create();

// variables
var path_source   = "./src/**/*";
var path_example  = "./example";
var path_app      = path_example + "/app";
var path_build    = path_example + "/build";

var path_html_input  = path_app   + "/**/*.html";
var path_html_output = path_build + "/";

var path_sass_input  = path_app   + "/assets/stylesheets/**/*.scss";
var path_sass_output = path_build + "/assets/stylesheets/";

var path_js_lib    = path_app   + "/assets/javascripts/lib/";
var path_js_input  = path_app   + "/assets/javascripts/**/*.js";
var path_js_output = path_build + "/assets/javascripts/";

// default
gulp.task("default", [
  "browser-sync"
]);

// tasks - build space
gulp.task("build:src", function() {
  return gulp.src(path_source).
    pipe(gulp.dest(path_js_lib));
});

gulp.task("build:js", function() {
  return gulp.src(path_js_input).
    pipe(gulp.dest(path_js_output));
});

gulp.task("build:sass", function() {
  return gulp.src(path_sass_input).
    pipe(sass().on("error", sass.logError)).
    pipe(gulp.dest(path_sass_output)).
    pipe(browserSync.stream());
});

gulp.task("build:html", function() {
  return gulp.src(path_html_input).
    pipe(gulp.dest(path_html_output));
});

gulp.task("build:clean", function() {
  return del([path_build]);
});

gulp.task("build", function(callback) {
  runSequence(
    "build:clean",
    [
      "build:src",
      "build:js",
      "build:sass",
      "build:html"
    ],
    callback
  );
});

// tasks - watch space

gulp.task("watch:js", ["build:js"], function(done) {
  browserSync.reload();
  done();
});

gulp.task("watch:html", ["build:html"], function(done) {
  browserSync.reload();
  done();
});

gulp.task("watch:sass", ["build:sass"], function(done) {
  done();
});

gulp.task("watch", function() {
  browserSync.init({
    server: {
      baseDir: path_build
    }
  });

  gulp.watch( path_html_input,  ["watch:html"]  ).on("change", function(event) {
    console.info(event.type, event.path);
  });
  gulp.watch( path_js_input,    ["watch:js"]    ).on("change", function(event) {
    console.info(event.type, event.path);
  });
  gulp.watch( path_sass_input,  ["build:sass"]  ).on("change", function(event) {
    console.info(event.type, event.path);
  });

  //gulp.watch(path_sass_input, ["build:sass"]).on("change", function(event) {
  //  console.info(event.type, event.path);
  //});
});
