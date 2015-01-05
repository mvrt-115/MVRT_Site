var $ = require('jquery')
//  , Mousetrap = require('mousetrap')
  , async = require('async')
  , fetch = require('./fetch-entries')
  , arrows = require('../arrows')
  , el = require('./elements')
  , sel = require('./selectors')
  , Carousel = require('./carousel')

var gallery = module.exports = function (options) {


  var isGalleryPage = !!$('.page-gallery').length

  function init () {
    if (!isGalleryPage) return
    if (!options || !options.user) throw new Error('No user!')
    async.waterfall([
      fetchAlbums,
      appendAlbums,
      bindGalleryUIActions
    ], function (err) {
      if (err) return console.error(err)
    })
  }

  function fetchAlbums (next) {
    fetch(
      require('./gen-gallery-url')({ user: options.user }),
      function (err, albums) {
        if (err) return next(err)
        next(null, require('./get-album-info')(albums))
      }
    )
  }

  function appendAlbums (albums, next) {
    el.$gallery.append(
      albums.map(function (album) {
        return '<li class=gallery-album ' +
          'data-album-id=' + album.id + '>' +
          '<img class="gallery-album-preview" ' +
          'src="' + album.thumb + '">' +
          '<span class="gallery-album-name">' + album.title +
          '</span></li>'
      })
    )
    next(null, albums)
  }

  function bindGalleryUIActions (albums, next) {
    // event delegation baby!
    el.$gallery.on('click', '.gallery-album', function () {
      displayAlbum($(this).attr('data-album-id'))
    })
    $(window).keyup(function (e) {
      if (!$(sel.photos)) return
      $(sel.photos).remove()
    })
  }

  function displayAlbum (id) {
    // another waterfall
    async.waterfall([
      function (next) {
        fetchPhotos(id, next)
      },
      createGallery
    ], bindAlbumUIEvents)
  }

  function fetchPhotos (albumid, next) {
    fetch(
      require('./gen-album-url')({ albumid: albumid, user: options.user }),
      function (err, photos) {
        if (err) return next(err)
        next(null, require('./get-photo-info')(photos))
      }
    )
  }

  function createGallery (photos, next) {
    $('body').append(
      '<div class="gallery-photos">' +
      arrows.leftDisabled + arrows.right +
      '<div class="gallery-photos-main"></div>' +
      '<div class="gallery-photos-carousel">' +
      '<ul>' +
      photos.reduce(function (acc, photo) {
        return acc + '<li><img src=' + photo.thumb +
          ' data-photo-url=' + photo.url +
          ' data-photo-medium=' + photo.medium +
          ' data-photo-type=' + photo.mimeType +
          '></li>'
      }, '') + '</ul></div></div>'
    )
    next(null, photos)
  }

  function bindAlbumUIEvents (err, photos) {
    // commence hell
    if (err) console.error(err)

    var carousel = new Carousel(photos) // man, a constructor
    carousel.init()

    $('body').on('click', sel.arrowLeft, carousel.prev)
    $('body').on('click', sel.arrowRight, carousel.next)
    $('body').on('click', sel.carouselThumb, function () {
      carousel.move($(this).parent().index())
    })

  }

  return {
    init: init
  }


}
