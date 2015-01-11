var $ = require('jquery')
  , homepage = require('./homepage')
  , gallery = require('./gallery')({ user: 'mvrtpicasa' })
  , dynamic = require('./dynamic')
  , redirect = require('./redirect')

$(function () {
  redirect()
  homepage.init()
  dynamic.init()
  gallery.init()
})
