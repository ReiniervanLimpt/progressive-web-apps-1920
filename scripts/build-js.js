const gulp = require('gulp')
const concat = require('gulp-concat');

return gulp.src([
    './static/js/*.js',
  ])
  .pipe(concat('index.js'))
  .pipe(gulp.dest('./static/'))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('ejg')
            return registration.update();
          }

        })
    .catch(() => console.log('service worker not registered'));
  })