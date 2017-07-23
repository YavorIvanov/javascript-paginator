// requirements
var gulp = require("gulp");
var sass = require("gulp-sass");

// variables
var sass_input  = './example/sass/**/*.scss';
var sass_output = './example/css';

// tasks
gulp.task("copy", function() {
  gulp.src(sass_input).pipe(sass()).pipe(gulp.dest(sass_output));
});

gulp.task("watch", function() {
  gulp.watch(sass_input, ["copy"]).on("change", function(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
  });
});
