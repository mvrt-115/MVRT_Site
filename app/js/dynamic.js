;(function ($, undefined) {
  
  $('document').ready(function () {
    if (!$('.about').length) return;
    $('.document-nav').on('click', 'a', function () {
      $('#about-content').load($(this).attr('data-subpage-url'))
    })

    $('[href="' + (window.location.hash || '#Overview') + '"]').click()

  });

})(jQuery)
