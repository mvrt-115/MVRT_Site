;(function ($, mvrt, undefined) {

  'use strict';

  mvrt = mvrt || {}

  // do something :)
  mvrt.greeting = { text: 'MVRT!!!'
                  , init: function () { console.log(this.text) }
                  }

  // do this when the document is ready
  $(document).ready(function () {
    mvrt.greeting.init()
  })

}(jQuery, window.mvrt = window.mvrt || {}))
