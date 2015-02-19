// ES6 Polyfills
require('babelify/polyfill')

// Fetch Polyfill
require('whatwg-fetch')

// redirect as early as possible
require('./redirect')()

// And now load the dependencies
var $ = require('jquery')
  , homepage = require('./homepage')
  , gallery = require('./gallery')
  , dynamic = require('./dynamic')
  , doc = require('./document')
  , nav = require('./nav')
  , blog = require('./blog')

// Wait until DOMContentLoaded
$(function () {
  nav.init()
  if ($('.home').length) homepage.init()
  if ($('.about').length) dynamic.init()
  if ($('.gallery').length) gallery.init()
  if ($('.document').length) doc.init()
  blog.init()
})
