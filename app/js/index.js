var $ = require('jquery')
  , homepage = require('./homepage')
  , gallery = require('./gallery')({ user: 'mvrtpicasa' })
  , dynamic = require('./dynamic')

$(function () {
  homepage.init()
  dynamic.init()
  gallery.init()
})
