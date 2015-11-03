var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
      rename: {
        'gulp-util': 'gutil',
        'gulp-autoprefixer': 'prefix',
        'gulp-ruby-sass': 'sass',
      }
    })
  , del = require('del')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , runSequence = require('run-sequence')
  , exec = require('child_process').exec

var merge = require('merge-stream')

var paths = {
  css: './app/assets/css', // no globbing
  images: ['./app/images/**/*'], // doesnt really matter
  svg: ['./app/assets/css/images/*'], // once there will be some
  fonts: ['./app/fonts'], // will come later
  js: ['./app/assets/js/main.js'] // browserify
}

var production = false // set true if in production mode

// development serve
gulp.task('serve', ['jekyll', 'css', 'js'], function () {
  browserSync.init({
    server: {
      baseDir: ['.jekyll', '.tmp', 'app'],
    },
    port: 4000
  })

  // watch and recompiles files
  gulp.watch([
    '_config.yml',
    'app/**/*.{html,yml,md,mkd,markdown,json}',
    '!app/_bower_components/**/*'
  ], ['jekyll', reload])
  gulp.watch([paths.css + '/**/*.scss'], ['css'])
  gulp.watch(['app/js/**/*.js'], ['jshint'])
  // browserify watches the javascripts

})


// serve production stuff
// DONT USE ON SERVER...I think
gulp.task('serve:dist', ['production'], function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    port: 4000,
    notify: false
  })
})

// scss -> autoprefixer -> good ol' css
gulp.task('css', function () {
  var options = { bundleExec: true, require: ['bourbon', 'neat'] }
  options.sourcemap = production ? false : true
  return $.sass(paths.css, options)
    .on('error', $.gutil.log.bind($.gutil))
    .pipe($.prefix())
    .pipe($.if(!production, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/css'))
    .pipe($.if(!production, reload({ stream: true })))
    .pipe($.size({ title: 'styles preminification' }))
})

// javascripts with browserify
gulp.task('js', function () {
  var bOptions = { entries: [paths.js], debug: true }
  var b = production ? browserify(bOptions) :
    watchify(browserify(bOptions), watchify.args)
  if (!production) b.on('update', bundle)
  function bundle () {
    return b.bundle()
      .on('error', $.gutil.log)
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.if(!production, $.sourcemaps.write()))
      .pipe(gulp.dest('.tmp/js'))
      .pipe($.if(!production, reload({ stream: true })))
      .pipe($.size({ title: 'javascripts preminification' }))
  }
  return bundle()
})

// jekyll
gulp.task('jekyll', function (done) {
  if (production) {
    exec('bundle exec jekyll build --source app --config _config.yml,_config.build.yml --destination dist', done)
  } else {
    exec('bundle exec jekyll build --source app --config _config.yml --destination .jekyll', done)
  }
})

// Compiles HTML
gulp.task('html', function () {

  var jsFilter = $.filter('**/*.js')
    , cssFilter = $.filter('**/*.css')
    , htmlFilter = $.filter('**/*.html')
    , indexFilter = $.filter('index.html')

  var assets = $.useref.assets({ searchPath: '{.tmp,app}' })

  return gulp.src('dist/**/*.html')
    .pipe(indexFilter) // only source from index.html
    .pipe(assets)
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe($.size({ title: 'scripts postminification' }))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe($.size({ title: 'styles postminification' }))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe(indexFilter.restore()) // now useref on on all the files
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.size({ title: 'html preminification' }))
    .pipe($.minifyHtml())
    .pipe($.size({ title: 'html postminification' }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))

})

// Revs images, replace links in other files
gulp.task('img', function () {

  var imgFilter = $.filter('**/*.{jpg,png,gif,svg,webp}')

  return gulp.src('dist/**/*')
    .pipe(imgFilter)
    .pipe($.size({ title: 'images preminification' }))
    .pipe($.imagemin({
      progressive: true,
      svgoplugins: [{ removeViewBox: false }],
      use: [require('imagemin-pngquant')()]
    }))
    .pipe($.size({ title: 'images postminification' }))
    .pipe($.rev())
    .pipe(imgFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
})

// copies stuff
gulp.task('copy', function () {
  var images = gulp.src('app/images/**/*', { base: 'app' })
    .pipe(gulp.dest('dist'))
  var htaccess = gulp.src('app/**/*.htaccess', { base: 'app'})
    .pipe(gulp.dest('dist'))
  var css = gulp.src('app/assets/css/images/**/*', { base: 'app'})
    .pipe(gulp.dest('dist'))
  return merge(htaccess, images, css)
})

gulp.task('production', ['clean'], function (cb) {
  production = true
  runSequence(
    'jshint',
    ['css','js','jekyll','copy'],
    'html',
    'img',
    cb
  )
})

// clean
gulp.task('clean', function (done) {
  del(['.tmp', '.jekyll', 'dist'], done)
})

gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail'))) // http://bit.ly/14lPNoj
})


gulp.task('default', ['production'])
