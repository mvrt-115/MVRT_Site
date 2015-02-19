exports.arrow = arrow

/**
 * Returns a terrible markup of an arrow.
 * @param {String} direction left|right|up|down
 * @param {Boolean} disabled If the arrow should be disabled
 */
function arrow (direction, disabled) {
  if (!/left|right|up|down/.test(direction)) {
    throw new Error('Wrong direction...')
  }
  return `<button class="arrow arrow-${direction}" type="button" ${disabled ? 'disabled' : ''}><i></i><i></i></button>`
}

// Handy Aliases
exports.left = arrow('left')
exports.right = arrow('right')
exports.up = arrow('up')
exports.down = arrow('down')

exports.leftDisabled = arrow('left', true)
exports.rightDisabled = arrow('right', true)
exports.upDisabled = arrow('up', true)
exports.downDisabled = arrow('down', true)
