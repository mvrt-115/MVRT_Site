var $ = require('jquery')

var links = {}

exports.init = function () {

  if (!$('.about').length) return;

  // Populates links with href: subpageUrl sort of thing
  $('.document-nav a').each(getSubpageUrl)

  // On link click, set the active link
  $('.document-nav').on('click', 'a', function () {
    setActive($(this).attr('href'))
  })

  // on hashchange, set the active link
  $(window).on('hashchange', function () {
    setActive(location.hash)
  })

  // set active page on page load, don't scroll
  setActive(location.hash || 'Overview', true)

}

// adds subpage url to links list
function getSubpageUrl () {
  links[$(this).attr('href').replace(/^#/, '')] = $(this).attr('data-subpage-url')
}

/**
 * sets active page based on anchor
 *
 * @param {string} anchor - anchor name
 * @param {boolean=} noScroll - should the page scroll?
 */
function setActive (anchor, noScroll) {
  if (!anchor) return
  anchor = anchor.replace(/^#/, '')
  $('.document-nav li').removeClass('active')
  $('.document').load(links[anchor])
  $('[data-subpage-url="' + links[anchor] + '"]').parent().addClass('active')
  if (!noScroll) $('html, body').scrollTop($('.document').position().top)
}
