// requirements
const gulp        = require('gulp');
const sass        = require('gulp-sass');
const del         = require('del');
const concat      = require('gulp-concat-multi');
const babel       = require('gulp-babel');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

// variables
const path_source       = './src/*.js';
const path_source_dist  = './src/dist';
const path_example      = './example';
const path_app          = path_example + '/app';
const path_build        = path_example + '/build';

const path_html_input  = path_app   + '/**/*.html';
const path_html_output = path_build + '/';

const path_sass_input  = path_app   + '/assets/stylesheets/**/*.scss';
const path_sass_output = path_build + '/assets/stylesheets/';

const path_js_lib    = path_app   + '/assets/javascripts/lib/';
const path_js_input  = path_app   + '/assets/javascripts/**/*.js';
const path_js_output = path_build + '/assets/javascripts/';

// default
gulp.task('default', function(callback) {
  runSequence(
    'build',
    'watch',
    callback
  );
});

// tasks - build space
gulp.task('build:src', function() {
  del([path_js_lib]); // clean up any remnants
  return concat({'javascript-paginator.js': path_source}).
    pipe(gulp.dest(path_source_dist)).
    pipe(gulp.dest(path_js_lib));
});

gulp.task('build:js', function() {
  return gulp.src(path_js_input).
    pipe(babel({
      presets: ['es2015']
    })).
    pipe(gulp.dest(path_js_output));
});

gulp.task('build:sass', function() {
  return gulp.src(path_sass_input).
    pipe(sass().on('error', sass.logError)).
    pipe(gulp.dest(path_sass_output)).
    pipe(browserSync.stream());
});

gulp.task('build:html', function() {
  return gulp.src(path_html_input).
    pipe(gulp.dest(path_html_output));
});

gulp.task('build:clean', function() {
  return del([path_build]);
});

gulp.task('build', function(callback) {
  runSequence(
    'build:clean',
    [
      'build:src'
    ],
    [
      'build:js',
      'build:sass',
      'build:html'
    ],
    callback
  );
});

// tasks - watch space

gulp.task('watch:src', ['build:src'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch:js', ['build:js'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch:sass', ['build:sass'], function(done) {
  done();
});

gulp.task('watch:html', ['build:html'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: path_build
    }
  });

  gulp.watch( path_source,      ['watch:src']   ).on('change', function(event) {
    console.info(event.type, event.path);
  });
  gulp.watch( path_js_input,    ['watch:js']    ).on('change', function(event) {
    console.info(event.type, event.path);
  });
  gulp.watch( path_sass_input,  ['build:sass']  ).on('change', function(event) {
    console.info(event.type, event.path);
  });
  gulp.watch( path_html_input,  ['watch:html']  ).on('change', function(event) {
    console.info(event.type, event.path);
  });
});
