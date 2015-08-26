var $ = require('jquery')

let links = {}

exports.init = function () {

  // Populates links with href: subpageUrl sort of thing
  $('.document-nav a').each(getSubpageUrl)

  // on hashchange, set the active link
  $(window).on('hashchange', () => setActive(location.hash))

  // set active page on page load, don't scroll
  setActive(location.hash || 'overview', true)

}

// adds subpage url to links list
function getSubpageUrl () {
  links[$(this).attr('href').replace(/^#/, '')] = $(this).attr('data-subpage-url')
}

/**
 * sets active page based on anchor
 * @param {string} anchor - anchor name
 * @param {boolean=} noScroll - should the page scroll?
 */
function setActive (anchor, noScroll) {
  if (!anchor) return
  let link = links[anchor.replace(/^#/, '')]
  if (!link) return
  $('.document-nav li').removeClass('active')
  $('.document').load(link)
  $(`[data-subpage-url="${link}"]`).parent().addClass('active')
  if (!noScroll) $('html, body').scrollTop($('.document').position().top)
}
