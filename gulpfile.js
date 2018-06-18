var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
      rename: {
        'gulp-util': 'gutil',
        'gulp-autoprefixer': 'prefix',
        'gulp-ruby-sass': 'sass',
        'gulp-image-resize': 'resize'
      }
    })
  , concurrent = require('concurrent-transform')
  , os = require('os')
  , del = require('del')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , exec = require('child_process').exec

var paths = {
  css: ['./app/scss/**/*'], // no globbing
  images: ['./app/img/**/*'], // doesnt really matter
  svg: ['./app/img/svg/**/*'], // once there will be some
  fonts: ['./app/fonts'], // will come later
  js: ['./app/js/index.js'] // browserify
}

var production = false // set true if in production mode

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

  var jsFilter = $.filter('**/*.js', {restore: true})
    , cssFilter = $.filter('**/*.css', {restore: true})
    , htmlFilter = $.filter('**/*.html', {restore: true})
    , indexFilter = $.filter('index.html', {restore: true})

  return gulp.src('dist/**/*.html')
    .pipe(indexFilter) // only source from index.html
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe($.size({ title: 'scripts postminification' }))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe($.size({ title: 'styles postminification' }))
    .pipe(cssFilter.restore)
    .pipe($.rev())
    .pipe(indexFilter.restore) // now useref on on all the files
    .pipe($.useref({ searchPath: '{.tmp,app}' }))
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.size({ title: 'html preminification' }))
    .pipe($.minifyHtml())
    .pipe($.size({ title: 'html postminification' }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest('dist'))

})

// Revs images, replace links in other files
gulp.task('img', function () {

  var imgFilter = $.filter('**/*.{jpg,png,gif,svg,webp}', {restore: true})

  // used to resize /img/people
  var peopleFilter = $.filter('**/img/people/**/*.{jpg,png,gif,svg,webp}', {restore: true});

  return gulp.src('dist/**/*')
    .pipe(imgFilter)
    .pipe($.size({ title: 'images original' }))
    .pipe(peopleFilter)
    .pipe(concurrent(
      $.resize({
        width: 350,
        height: 525,
        crop: true,
        noProfile: true
      }),
      os.cpus().length
    ))
    .pipe($.size({ title: 'images post-resize' }))
    .pipe(peopleFilter.restore)
    .pipe($.imagemin({
      progressive: true,
      svgoplugins: [{ removeViewBox: false }],
      use: [require('imagemin-pngquant')()]
    }))
    .pipe($.size({ title: 'images post-minification' }))
    .pipe($.rev())
    .pipe(imgFilter.restore)
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
})

// copies stuff
gulp.task('copy', function () {
  return gulp.src('app/img/**/*', { base: 'app' })
    .pipe(gulp.dest('dist'))
})

// clean
gulp.task('clean', function (done) {
  del.sync(['.tmp', '.jekyll', 'dist'])
  done()
})

gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail'))) // http://bit.ly/14lPNoj
})

// development serve
gulp.task('serve', gulp.parallel('jekyll', 'css', 'js', function () {
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
  ], gulp.series('jekyll', reload))
  gulp.watch([paths.css + '/**/*.scss'], gulp.series('css'))
  gulp.watch(['app/js/**/*.js'], gulp.series('jshint'))
  // browserify watches the javascripts

}))

gulp.task('set-production', function (cb) {
  production = true
  cb()
})

gulp.task('production',
  gulp.series(
    'set-production',
    'clean',
    'jshint',
    gulp.parallel('css', 'js', 'jekyll', 'copy'),
    'html',
    'img'
  )
)

// serve production stuff
// DONT USE ON SERVER...I think
gulp.task('serve:dist', gulp.series('production', function () {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    port: 4000,
    notify: false
  })
}))


gulp.task('default', gulp.series('production'))
