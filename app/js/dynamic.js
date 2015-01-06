var $ = require('jquery')

exports.init = function () {
  if (!$('.about').length) return;
  $('.document-nav').on('click', 'a', setActive)
  $('[href="' + (window.location.hash || '#Overview') + '"]').click()
}

function setActive () {
  $('.document-nav li').removeClass('active')
  $('.document').load($(this).attr('data-subpage-url'))
  $(this).parent().addClass('active')
}
