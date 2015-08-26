var $ = require('jquery')
  , Waypoint = require('waypoints')
  , sticky = require('sticky')

let $nav
  , $navUl
  , $navLinks
  , $footer
  , stickyNav
  , anchors
  , anchorTimeout

/**
 * Assign variables to elements
 */
function bindElements () {
  $nav = $('.document-nav')
  $navUl = $('.document-nav ul')
  $navLinks = $('.document-nav a')
  $footer = $('.site-footer')
}

/**
 * Fixes the nav > ul width on scroll
 */
function setNavWidth () {
  let navWidth = $nav.width()
  $navUl.width(navWidth)
}

/**
 * Binds UI Events
 */
function bindUIEvents () {

  if (!$navUl[0]) return
  stickyNav = new Waypoint.Sticky({
    element: $navUl[0],
    wrapper: null
  })

  $(window)
    .on('scroll', function () {
      let navHeight = $nav[0].clientHeight
        , footerTop = $footer[0].getBoundingClientRect().top
        , diff = footerTop - navHeight
      $navUl.css('top', `${diff < 0 ? diff : 0}px`)
    })
    .on('resize', setNavWidth)

  anchors = $navLinks
    .map((idx, el) => $(el).attr('href'))
    .filter((idx, el) => /^#/.test(el))
    .map((index, element) => $(element)[0])
    .waypoint({
      handler: function () {
        setActive($(`[href="#${this.element.id}"]`).parent())
      }
    })

  $nav.on('click', 'a', function (e) {
    if ($(this).attr('data-subpage-url')) return
    clearTimeout(anchorTimeout)
    let $target = $($(this).attr('href'))
    e.preventDefault() // this removes the anchorlinks
    $('html, body').animate({
      scrollTop: $target.position().top
    }, 750)
    disableAnchors()
    setActive($(this).parent())
    anchorTimeout = setTimeout(enableAnchors, 800)
  })

}

/**
 * Set active element
 * @param {jQuery} el Element to set active
 * @returns el The element
 */
function setActive ($el) {
  $('.active').removeClass('active')
  return $el.addClass('active')
}

/**
 * Disable anchors
 */
function disableAnchors () {
  anchors.forEach(anchor => anchor.disable())
}

/**
 * Enable anchors
 */
function enableAnchors () {
  anchors.forEach(anchor => anchor.enable())
}


/**
 * Initializes everything.
 */
exports.init = function init () {
  bindElements()
  if (!$nav.length) return
  bindUIEvents()
  setNavWidth()
}
