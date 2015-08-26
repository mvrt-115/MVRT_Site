var $ = require('jquery')
  , arrows = require('./arrows')

module.exports = Carousel

/**
 * The Carousel.
 * Basically a factory for a jQuery gallery slideshow thing.
 * @param {Object} Options { photos = [], element = $(el) }
 * @returns Carousel
 */
function Carousel (options = {}) {

  if (!(this instanceof Carousel)) return new Carousel(options)

  if (!options.photos) return
  if (!options.element) options.element = $('<div class="gallery-photos"></div>')

  let photos = options.photos
    , index = 0
    , numPhotos = options.photos.length
    , $element = options.element instanceof $ ? options.element : $(options.element)
    , $left = $(arrows.left).on('click', prev)
    , $right = $(arrows.right).on('click', next)
    , $close = $('<button type="button" class="button-close">×</button>').on('click', destroy)
    , $main = $('<div class="gallery-photos-main"></div>')
    , $photos = photos.map($ifyPhotoThumbnail)
    , $thumbs = $('<ul></ul>').append($photos)
    , $thumbsWrap = $('<div class="gallery-photos-carousel"></div>').append($thumbs)
    , $currThumb

  $element
    .append($left)
    .append($right)
    .append($close)
    .append($main)
    .append($thumbsWrap)

  /**
   * Sets the index if possible. Returns null if it fails.
   * @param {Number|String} idx index
   * @returns Number The index
   * @private
   */
  function setIndex (idx) {
    if (idx < 0 || idx >= numPhotos) return
    index = idx
    return idx
  }

  /**
   * Moves to a photo. Does not move if out of range.
   * @param {Number|String} idx index of the photo
   * @returns Carousel
   * @public
   */
  function move (idx) {
    if (setIndex(idx) == null) return
    displayPhoto(idx)
    setArrows(idx)
    setThumb(idx)
    return this
  }

  /**
   * Moves to the next photo.
   * @returns Carousel
   * @public
   */
  function next () {
    move(index + 1)
    return this
  }

  /**
   * Moves left.
   * @returns Carousel
   * @public
   */
  function prev () {
    move(index - 1)
    return this
  }

  /**
   * Initializes the Carousel.
   * @returns Carousel
   * @public
   */
  function init () {
    move(index)
    return this
  }

  /**
   * Sets the main photo.
   * @param {Number|String} idx index of the photo
   * @private
   */
  function displayPhoto (idx) {
    let photo = photos[idx]
    $main
      .empty()
      .append(photo.medium === 'video' ? `<video controls src=${photo.src}>` : `<img src=${photo.src}>`)
  }

  /**
   * Sets the state of the arrows.
   * @param {Number|String} idx index of the photo
   * @private
   */
  function setArrows (idx) {
    $left.prop('disabled', idx <= 0 ? true : false)
    $right.prop('disabled', idx >= numPhotos - 1 ? true : false)
  }

  /**
   * Sets the current thumbnail
   * @param {Number|String} idx index of the photo
   * @private
   */
  function setThumb (idx) {
    if ($currThumb) $currThumb.removeClass('js-active-thumb')
    $currThumb = $photos[idx].addClass('js-active-thumb')
  }

  /**
   * Returns the jQuery element of the "Carousel"
   * @returns jQuery The "Carousel" element
   * @public
   */
  function getElement () {
    return $element
  }

  /**
   * Removes the gallery element from it's context.
   * @public
   */
  function destroy () {
    $element
      .trigger('destroy')
      .remove()
  }

  /**
   * jQueryify the thumbnailish
   * @param {Object} photo { src, thumb }
   * @returns {jQuery} jQuery object of the photo thumb
   * @private
   */
  function $ifyPhotoThumbnail (photo, index) {
    let $thumb = $('<li></li>')
      , $img = $(`<img src=${photo.thumb}>`)
    return $thumb
      .append($img)
      .attr('data-photo-src', photo.src)
      .on('click', () => move(index))
  }

  return { move, next, prev, init, getElement, destroy }

}
