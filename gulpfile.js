const gulp         = require('gulp');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync');
const cssnano      = require('gulp-cssnano');
const rename       = require('gulp-rename');
const rigger       = require('gulp-rigger');
const sourcemaps   = require('gulp-sourcemaps');
const htmlmin      = require('gulp-htmlmin');
const del          = require('del');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const cache        = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const plumber      = require('gulp-plumber');
const sassGlob     = require('gulp-sass-glob');

gulp.task('clear', () => {
  return cache.clearAll();
})

gulp.task('clean', async () => {
  return del.sync('build');
});

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './build'
    },
    notify: false
  });
});

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', () => {
  return gulp.src('src/sass/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', () => {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('build/img'));
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', gulp.parallel('html'));
  gulp.watch('src/sass/**/*.sass', gulp.parallel('sass', 'css'));
  gulp.watch('src/js/**/*.js', gulp.parallel('scripts'));
  gulp.watch('src/img/**/*.*', gulp.parallel('img'));
});

gulp.task('build', gulp.parallel('clean', 'html', 'css', 'sass', 'img', 'scripts'));
gulp.task('start', gulp.parallel('clean', 'html', 'css', 'sass', 'img', 'scripts', 'browser-sync', 'watch'));
