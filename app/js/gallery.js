var $ = require('jquery')
  , picasaUrl = require('./picasa-url')
  , carousel = require('./carousel')

// constants
const PICASA_USER = 'mvrtpicasa'
const PICASA_USER_FIELDS = 'entry(id,media:group(media:thumbnail,media:title))'
const PICASA_ALBUM_FIELDS = 'title,icon,openSearch:totalResults,openSearch:itemsPerPage,entry(media:group(media:content,media:thumbnail,media:title))'
const PICASA_USER_URL = picasaUrl({ userId: PICASA_USER, fields: PICASA_USER_FIELDS })

module.exports.init = function init () {
  // jquery's promise implementation (aka 'deferred') is terrible
  $.getJSON(PICASA_USER_URL)
    .then(function (data) {
      $('.gallery').remove() // delete the old node
      data.feed.entry
        .map(getAlbumInfo)
        .map($ifyAlbumThumbnail)
        .reduce(($gallery, $thumb) => $gallery.append($thumb), $('<ul class="gallery"></ul>'))
        .appendTo($('.document'))
    }, (jqXHR, textStatus, err) => console.error(textStatus))
}

/**
 * Creates a thing?
 * @param {Object} options { userId, albumId }
 */
function createGallery (options) {
  fetch(picasaUrl(Object.assign(options, { fields: PICASA_ALBUM_FIELDS })))
    .then(data => data.json())
    .then(data => {
      let photos = data.feed.entry.map(getPhotoInfo)
        , gallery = carousel({ photos: photos })
      gallery.init().getElement().appendTo(document.body)
      $('html, body').css('overflow', 'hidden')
      $(window).on('keyup', control)
      function control (e) {
        switch (e.keyCode) {
          case 27:
            gallery.destroy()
            $('html, body').css('overflow', 'auto')
            $(window).off('keyup', control)
            break
          case 37:
            gallery.prev()
            break
          case 39:
            gallery.next()
            break
        }
      }
    }, (jqXHR, textStatus, err) => console.error(textStatus))
}

/**
 * Gets some album info from the Picasa Web Albums format
 * @param {Object} album An album
 * @returns {Object} { id, title, thumb }
 */
function getAlbumInfo (album) {
  let title = album.media$group.media$title.$t
    , thumb = album.media$group.media$thumbnail[0].url
    , id = /^.*albumid\/(\d+)\?.*$/.exec(album.id.$t)[1]
  return { id, title, thumb }
}

/**
 * Gets some photo info from the Picasa Web Albums format
 * @param {Object} photo A photo
 * @returns {Object} { id, thumb, src, title }
 */
function getPhotoInfo (photo) {
  photo = photo.media$group
  let title = photo.media$title.$t
    , thumb = photo.media$thumbnail[0].url
    , data = photo.media$content[(photo.media$content.length - 1) > 2 ? 2 : photo.media$content.length - 1]
    , src = data.url
    , type = data.type
    , medium = data.medium
  return { title, src, type, thumb, medium }
}

/**
 * jQueryify the thumbnailish
 * @param {Object} album { id, title, thumb }
 * @returns {jQuery} jQuery object of the album
 */
function $ifyAlbumThumbnail (album) {
  let $thumb = $('<li class="gallery-album"></li>')
    , img = document.createElement('img')
    , $img = $(img).addClass('gallery-album-preview')
    , title = '<span class="gallery-album-name">' + album.title + '</span>'
  $thumb
    .addClass('js-album-thumbnail-loading')
    .append(img)
    .append(title)
    .attr('data-album-id', album.id)
    .on('click', () => createGallery({ userId: PICASA_USER, albumId: album.id }))
  img.src = album.thumb
  $img.on('load', () => $thumb.removeClass('js-album-thumbnail-loading'))
  return $thumb
}
