const path = require('path');

const size = require('gulp-size');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const del = require('del');

const argv = require('yargs').argv;

const isServe = argv._.includes('serve');

const isProd = argv.prod === true;

const browserSync = require('browser-sync').create();

const srcPath = 'src';
const outputPath = 'dist';

const paths = {
  scripts: {
    src: path.join(srcPath, 'js/**/*.js'),
    dest: path.join(outputPath, 'js')
  },
  styles: {
    src: path.join(srcPath, 'css/**/*.css'),
    dest: path.join(outputPath, 'css')
  }
};

const clean = () => {
  return del([
    paths.scripts.dest,
    paths.styles.dest
  ]);
};

const styles = () => {
  const task = gulp.src(paths.styles.src)
    .pipe(postcss(
      [
        autoprefixer({
          browsers: ['ie >= 9', 'last 4 version']
        })
      ]
    ))
    .pipe(rename('collapse.css'))
    .pipe(gulp.dest(path.resolve(paths.styles.dest)));
  
  if (isServe) {
    task
      .pipe(browserSync.stream());
  }
  
  if (isProd) {
    task
      .pipe(postcss([cssnano]))
      .pipe(rename({baseName: 'collapse', extname: '.min.css'}))
      .pipe(size({showFiles: true}))
      .pipe(gulp.dest(paths.styles.dest));
  }
  
  return task;
};

const scripts = () => {
  const task = browserify({
    entries: ['./src/js/main.js']
  })
    .transform(babelify.configure({
      presets: ['@babel/preset-env']
    }))
    .bundle()
    .pipe(source('collapse.js'))
    .pipe(gulp.dest(path.resolve(paths.scripts.dest)));
  
  if (isServe) {
    task
      .pipe(browserSync.stream());
  }
  
  if (isProd) {
    task
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(size({showFiles: true}))
      .pipe(gulp.dest(path.resolve(paths.scripts.dest)));
  }
  
  return task;
};

const build = gulp.series(clean, gulp.parallel(styles, scripts));

const bsInit = () => {
  browserSync.init({
    server: {
      baseDir: "example",
      routes: {
        "/css": "dist/css",
        "/js": "dist/js"
      }
    },
  });
};

const watchFiles = () => {
  gulp.watch(paths.scripts.src, gulp.parallel(scripts));
  gulp.watch(paths.styles.src, gulp.parallel(styles));
  
  if (isServe) {
    gulp.watch('example/*.html').on('change', browserSync.reload);
  }
};

const serve = gulp.series(build, gulp.parallel(bsInit, watchFiles));

const watch = gulp.series(build, watchFiles);

gulp.task('default', build);

module.exports = {watch, serve};

