var $ = require('jquery')

let $btn = $('.site-nav-btn')
  , $navUl = $('.site-nav ul')

// Should be very obvious
exports.init = function () {
  $btn.click(() => $navUl.toggleClass('js-active'))
}
