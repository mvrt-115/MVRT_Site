var $ = require('jquery')

exports.init = function () {
  if (!$('.about').length) return;
  $('.document-nav').on('click', 'a', function () {
    $('.document').load($(this).attr('data-subpage-url'))
  })

  $('[href="' + (window.location.hash || '#Overview') + '"]').click()
}
