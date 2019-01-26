const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  stylus = require('gulp-stylus'),
  rename = require('gulp-rename'),
  spritesmith = require('gulp.spritesmith'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  rimraf = require('rimraf'),
  autoprefixer = require('gulp-autoprefixer'),
  postcss = require('gulp-postcss');

gulp.task('server', () => {
  browserSync.init({
    server: {
      port: 8081,
      baseDir: 'build'
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('pug:compile', () => {
  return gulp
    .src('./source/index.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest('build'));
});

gulp.task('stylus:compile', () => {
  return gulp
    .src(['./source/styles.styl', './source/js/libs/swiper/swiper.min.css'])
    .pipe(stylus())
    .pipe(
      autoprefixer({
        browsers: ['last 4 versions', 'Firefox >= 15']
      })
    )
    .pipe(concat('styles.css'))
    .pipe(postcss([require('postcss-flexibility')]))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('stylus:compile-min', () => {
  return gulp
    .src(['./source/styles.styl', './source/js/libs/swiper/swiper.min.css'])
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 4 versions', 'Firefox >= 15']
      })
    )
    .pipe(postcss([require('postcss-flexibility')]))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js-libs:compile', done => {
  gulp
    .src(['./source/js/libs/jquery-3.2.1.min.js', './source/js/libs/flexibility.js', './source/js/libs/swiper/swiper.min.js'])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./build/js'));

  done();
});

gulp.task('js:compile', done => {
  gulp
    .src('./source/js/main.js')
    .pipe(
      babel({
        presets: ['es2015']
      })
    )
    .pipe(gulp.dest('./build/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));

  done();
});

gulp.task('sprite', cb => {
  let spriteData = gulp.src(['./source/templates/slider/slider/sprites/*.png']).pipe(
    spritesmith({
      imgName: 'sprite-0.png',
      cssName: 'sprite-0.css'
    })
  );

  spriteData.img.pipe(gulp.dest('./build/img/'));
  spriteData.css.pipe(gulp.dest('./source/templates/slider/'));

  cb();

  spriteData = gulp.src(['./source/templates/portfolio/portfolio/sprites/*.png']).pipe(
    spritesmith({
      imgName: 'sprite-1.png',
      cssName: 'sprite-1.css'
    })
  );

  spriteData.img.pipe(gulp.dest('./build/img/'));
  spriteData.css.pipe(gulp.dest('./source/templates/portfolio/'));

  cb();

  spriteData = gulp.src(['./source/templates/advantages/advantages/sprites/*.png']).pipe(
    spritesmith({
      imgName: 'sprite-2.png',
      cssName: 'sprite-2.css'
    })
  );

  spriteData.img.pipe(gulp.dest('./build/img/'));
  spriteData.css.pipe(gulp.dest('./source/templates/advantages/'));

  cb();

  spriteData = gulp.src(['./source/templates/footer/footer/sprites/*.png']).pipe(
    spritesmith({
      imgName: 'sprite-3.png',
      cssName: 'sprite-3.css'
    })
  );

  spriteData.img.pipe(gulp.dest('./build/img/'));
  spriteData.css.pipe(gulp.dest('./source/templates/footer/'));

  cb();
});

gulp.task('clean', cb => {
  return rimraf('build', cb);
});

gulp.task('copy:fonts', () => {
  return gulp.src('./source/fonts/**/*.*').pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', () => {
  return gulp
    .src(['./source/**/*.png', '!./source/**/sprites/*.png'])
    .pipe(
      rename({
        dirname: 'img'
      })
    )
    .pipe(gulp.dest('build/'));
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', () => {
  gulp.watch('./source/**/*.pug', gulp.series('pug:compile'));
  gulp.watch('./source/**/*.styl', gulp.series(['stylus:compile', 'stylus:compile-min']));
  gulp.watch('./source/**/*.js', gulp.series(['js-libs:compile', 'js:compile']));
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('pug:compile', 'stylus:compile', 'stylus:compile-min', 'js-libs:compile', 'js:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
  )
);
