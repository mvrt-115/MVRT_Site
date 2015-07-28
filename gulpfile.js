// gulpfile.js
// Most of the build tasks go in here.
// See https://github.com/gulpjs/gulp/tree/master/docs

// Dependencies/Plugins
// Gulp plugins are prefixed with a `$`
var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
      rename: { 'gulp-ruby-sass': 'sass' }
    })
  , del = require('del')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , browserSync = require('browser-sync')
  , reload = browserSync.reload
  , spawn = require('cross-spawn')
  , dargs = require('dargs')
  , merge = require('merge-stream')

// A "flag", set to true if in production mode.
var production = false

// bs-reload for reloading HTML
gulp.task('bs-reload', function () { reload() })

// Serves files for development.
gulp.task('serve', ['jekyll', 'stylesheets', 'javascripts'], function () {

  browserSync.init({
    server: { baseDir: ['.tmp', 'app'] },
    port: 4000
  })

  // watch and recompiles files
  gulp.watch([
    './_config.yml',
    './app/**/*.{html,yml,md,mkd,markdown,json}',
    '!./app/_bower_components/**/*'
  ], ['jekyll'])
  gulp.watch(['./.tmp/**/*.html'], ['bs-reload'])
  gulp.watch(['./app/_scss/**/*.scss'], ['stylesheets'])
  gulp.watch(['./app/js/**/*.js'], ['jshint'])

})

// Serves the production mode.
gulp.task('serve:dist', ['build'], function () {
  browserSync.init({
    server: { baseDir: 'dist' },
    port: 4000,
    notify: false
  })
})

// Mini Tasks
gulp.task('stylesheets', stylesheets)
gulp.task('javascripts', javascripts)
gulp.task('jekyll', jekyll)
gulp.task('images', images)

// Stylesheets stream/task.
// Sass => Autoprefixer => Unminified CSS File
function stylesheets () {
  var opts = {
    bundleExec: true,
    require: ['bourbon', 'neat'],
    sourcemap: production ? false : true
  }
  return $.sass('./app/_scss/main.scss', opts)
    .on('error', function (err) { $.util.log(err.message) })
    .pipe($.autoprefixer())
    .pipe($.if(!production, $.sourcemaps.write()))
    .pipe($.rename(function (path) { path.dirname = 'css' }))
    .pipe(gulp.dest('./.tmp'))
    .pipe($.if(!production, reload({ stream: true })))
    .pipe($.size({ title: 'stylesheets preminification' }))
}

// Javascripts stream/task.
// Utilizes Browserify + Crew
function javascripts () {
  var opts = { entries: ['./app/js/index.js'], debug: true }
  var b = production
    ? browserify(opts)
    : watchify(browserify(opts), watchify.args).on('update', bundle)
  function bundle () {
    return b
      .transform('browserify-shim')
      .bundle()
      .on('error', function (err) { $.util.log('Browserify Error:', err.message) })
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.if(!production, $.sourcemaps.write()))
      .pipe($.rename(function (path) { path.dirname = 'js' }))
      .pipe(gulp.dest('./.tmp'))
      .pipe($.if(!production, reload({ stream: true })))
      .pipe($.size({ title: 'javascripts preminification' }))
  }
  return bundle()
}

// Jekyll stream/task.
// Jekyll is funny in the sense that streaming is not possible.
// So we just write the files to a special .jekyll directory.
// And source that later and pipe that through a noop stream.
function jekyll () {
  var tr = $.util.noop()
  var cmd = ['bundle', 'exec', 'jekyll', 'build'].concat(dargs({
    source: 'app',
    config: production ? '_config.yml,_config.build.yml' : '_config.yml',
    destination: '.jekyll'
  }))
  spawn(cmd.shift(), cmd, { stdio: 'inherit' })
    .on('close', function (code) {
      if (production && code !== 0) {
        throw new $.util.PluginError('jekyll', 'jekyll had an error')
      }
      gulp.src('./.jekyll/**/{.*,*}').pipe(tr)
    })
  return tr
    .pipe(gulp.dest('./.tmp'))
}

// Images stream/task.
// In short, compresses images.
function images () {
  return gulp.src('./app/img/**/*')
    .pipe($.size({ title: 'images preminification' }))
    .pipe($.imagemin({
      progressive: true,
      svgoplugins: [{ removeViewBox: false }],
      use: [require('imagemin-pngquant')()]
    }))
    .pipe($.size({ title: 'images postminification' }))
    .pipe($.rename(function (path) { path.dirname = 'img/' + path.dirname }))
    .pipe(gulp.dest('./.tmp'))
}

// Assembles the site task.
// Actually, there is an assemble package on npm that is like Jekyll but for
// Node/io.js
gulp.task('assemble', ['clean', 'jshint'], function () {

  // Sets production to true.
  production = true

  // Various filters to filter out certain files.
  var imgFilter = $.filter('**/*.{jpg,png,gif,svg,webp}')
    , jsFilter = $.filter('**/*.js')
    , cssFilter = $.filter('**/*.css')
    , htmlFilter = $.filter('**/*.html')
    , index = $.filter('index.html')
    , assets = $.useref.assets({ searchPath: '{.tmp,app}' })

  // This is a gigantic stream that in short
  // a) Minifies stuff, and
  // b) revisions stuff
  return merge()
    .add(stylesheets())
    .add(javascripts())
    .add(images())
    .add(jekyll())
    .pipe(gulp.dest('./dist'))
    .pipe(imgFilter)
    .pipe($.rev())
    .pipe(imgFilter.restore())
    .pipe($.revReplace())
    .pipe(index)
    .pipe(assets)
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe($.size({ title: 'stylesheets postminification' }))
    .pipe(cssFilter.restore())
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe($.size({ title: 'javascripts postminification' }))
    .pipe(jsFilter.restore())
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe(index.restore())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.useref())
    .pipe($.size({ title: 'html preminification' }))
    .pipe($.minifyHtml())
    .pipe($.size({ title: 'html postminification' }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('./dist'))

})

// Clean up messes.
gulp.task('clean', function (done) {
  del(['.tmp', '.jekyll', 'dist'], done)
})

// JSHint - for code quality and error checking.
// Note that currently if JSHint fails on build then the site won't compile.
gulp.task('jshint', function () {
  return gulp.src('./app/js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail'))) // http://bit.ly/14lPNoj
})

// Aliases for assemble.
gulp.task('build', ['assemble'])
gulp.task('production', ['assemble'])

// Default task an alias for assemble.
gulp.task('default', ['assemble'])
