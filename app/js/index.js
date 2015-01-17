var $ = require('jquery')
  , homepage = require('./homepage')
  , gallery = require('./gallery')({ user: 'mvrtpicasa' })
  , dynamic = require('./dynamic')
  , doc = require('./document')
  , redirect = require('./redirect')

$(function () {
  redirect()
  homepage.init()
  dynamic.init()
  gallery.init()
  doc.init()
})
