// requirements
var gulp        = require("gulp");
var sass        = require("gulp-sass");
var browserSync = require("browser-sync").create();

// variables
var path_source       = "./src/**/*";
var path_example_src  = "./example/src/";
var path_example_pub  = "./example/public/";


var path_sass_input  = path_example_src + "assets/stylesheets/**/*.scss";
var path_sass_output = path_example_pub + "assets/stylesheets/";

// default
gulp.task("default", [
  "copy", "browser-sync"
]);

// tasks
gulp.task("copy-lib", function() {
  gulp.src(path_source).
    pipe(gulp.dest(path_example_pub));
});

gulp.task("copy-sass", function() {
  gulp.src(path_sass_input).
    pipe(sass()).
    pipe(gulp.dest(path_sass_output));
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: path_example_pub
    }
  });
});

gulp.task("watch", function() {
  gulp.watch(path_sass_input, ["copy"]).on("change", function(event) {
    console.log(event.type, event.path);
  });
});
