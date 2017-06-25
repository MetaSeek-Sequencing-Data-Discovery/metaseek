var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglifyify = require('uglifyify');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

/*
  Styles optimization / minification
*/
gulp.task('styles',function() {
  // Compiles CSS
  gulp.src('css/styles.css')
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(gulp.dest('./build/css'))
    .pipe(reload({stream:true}));
});

/*
  Images squishing
*/
gulp.task('images',function() {
  // no images in css/images
  //gulp.src('css/images/**')
  //  .pipe(imagemin())
  //  .pipe(gulp.dest('./build/css/images'));

  gulp.src('images/**')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/images'));

});

gulp.task('copy-index-html', function() {
    gulp.src('index.html')
      .pipe(htmlreplace({'css': './css/styles.css','js': './main.js'}))
      .pipe(gulp.dest('./build'));
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    debug : true,
    transform:  [babelify, reactify]
  };

  props = watch ? Object.assign({}, watchify.args, props) : props;
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/'))
      .pipe(reload({stream:true}));
  }

  bundler.on('update', function() {
    rebundle();
  });

  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

gulp.task('default', ['copy-index-html','images','styles','browser-sync'], function() {
  gulp.watch('css/styles.css', ['styles']); // gulp watch for style changes
  return buildScript('main.js', true); // browserify watch for JS changes
});

gulp.task('apply-prod-environment', function() {
    process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
    process.env.NODE_ENV = 'production';
    if (process.env.NODE_ENV != 'production') {
        throw new Error("Failed to set NODE_ENV to production!!!!");
    } else {
        process.stdout.write("Successfully set NODE_ENV to production" + "\n");
    }
});

gulp.task('build', ['apply-prod-environment','copy-index-html','images','styles'],function() {
  return browserify({
          entries: ['./scripts/main.js'],
          debug : false,
          transform:  [babelify, reactify, uglifyify]
        })
        .bundle()
        .on('error', handleErrors)
        .pipe(source('main.js'))
        .pipe(buffer()) //  uglifying ~doubles the time to build but saves ~30% space in output filesize
        .pipe(uglify({ mangle: true }))
        .pipe(gulp.dest('./build'));
});
