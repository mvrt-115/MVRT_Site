var sel = require('./selectors')
  , $ = require('jquery')

module.exports = function Carousel (photos) {

  var index = 0
    , numPhotos = photos.length

  function setIndex (idx) {
    if (idx < 0 || idx > numPhotos) return;
    index = idx
    return index === 0 ? true : index
  }

  function move (idx) {
    if(!setIndex(idx)) return
    displayPhoto(idx)
    moveCarousel(idx)
    setArrows(idx)
  }

  function next () {
    move(index + 1)
  }

  function prev () {
    move(index - 1)
  }

  function moveCarousel (idx) {
    // -160 is thumb size
    $(sel.carousel).css('left', -160 * idx)
  }

  function displayPhoto (idx) {
    var photo = photos[idx]
    $(sel.main).empty()
    $(sel.main).append(photo.medium === 'video' ?
      '<video controls src=' + photo.url + '>' : '<img src=' + photo.url + '>'
    )
  }

  function setArrows (idx) {
    if (idx === 0) $(sel.arrowLeft).prop('disabled', true)
    else if (idx === numPhotos - 1) $(sel.arrowRight).prop('disabled', true)
    else $(sel.arrow).prop('disabled', false)
  }

  function init () {
    move(index)
  }


  return {
    move: move,
    next: next,
    prev: prev,
    init: init
  }

}
