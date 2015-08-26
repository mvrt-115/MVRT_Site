var $ = require('jquery')
  , arrows = require('./arrows')

/**
 * Add arrows to homepage scrolling.
 */
exports.init = function () {
  $(arrows.down)
    .appendTo($('.step'))
    .on('click', function () {
      scrollStep($(this).parent().next().position().top)
    })
}

/**
 * Scrolls...
 * Also see this: http://bit.ly/1BfD1DW
 */
function scrollStep (scrollTop) {
  $('html, body').animate({ scrollTop }, 750, 'linear')
}
