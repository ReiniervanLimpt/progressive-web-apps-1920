const gulp = require('gulp')

return gulp.src([
    './src/images/**/*.*',
    './src/manifest.json',
  ])
  .pipe(gulp.dest('./static/'))