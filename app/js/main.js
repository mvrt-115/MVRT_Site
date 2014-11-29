;(function ($, window, document, undefined) {

  'use strict';

  var pages = { home: $('.home')
              , gallery: $('.page-gallery')
              }

    , el = { header: $('.site-header')
           , nav: $('.site-nav')
           , hero: $('.hero')
           , main: $('.site-main')
           , gallery: $('.gallery')
           , footer: $('.site-footer')
           }

    , gallery
    , home
    , greeting

  home = (function () {
    var isHomePage = $('.home')

    function scrollStep (scrollTop) {
      $('html, body').animate({ scrollTop: scrollTop }, 750, 'linear')
    }

    function bindUIEvents () {
      $('.step').append('<button class="arrow arrow-down" type="button"><i></i><i></i></button>')
      $('.step .arrow').click(function () {
        scrollStep($(this).parent().next().position().top)
      })
    }

    function init () {
      if (!isHomePage)
        return
      bindUIEvents()
    }

    return { bindUIEvents: bindUIEvents
           , init: init
           }
  })()

  gallery = (function () {
    var urlprefix = 'https://picasaweb.google.com/data/feed/base/user/'
      , user = 'mvrtpicasa'
      , format = 'json'
      , thumbsize = 160
      , imgmax = 1280
      , albumsUrl = urlprefix +
                    user +
                    '?alt=' + format +
                    '&thumbsize=' + thumbsize
      , currentAlbum
      , currentPhoto

    // displays a photo yay
    function displayPhoto (url, medium, type) {
      $('.gallery-photos-main').empty()
      $('.gallery-photos-main').append(
        medium === 'video' ?  '<video controls src=' + url + '>' :
                              '<img src=' + url + '>'
      )
    }

    function moveCarousel (index) {
      $('.gallery-photos-carousel ul').css('left', -160 * index)
    }

    // displays an album
    // for now only displays the first 1000
    function displayAlbum (albumid) {
      var albumUrl = urlprefix + user +
                     '/albumid/' + albumid +
                     '?alt=' + format +
                     '&thumbsize=' + thumbsize +
                     '&imgmax=' + imgmax
      $.getJSON(albumUrl, function (data) {
        var photos = data.feed.entry
        currentAlbum = photos.map(function (photo) {
          photo = photo.media$group
          var content = photo.media$content[photo.media$content.length - 1]
            , photoUrl = content.url
            , photoMedium = content.medium
            , photoType = content.type
            , thumbnail = photo.media$thumbnail[0].url
          return { url: photoUrl
                 , medium: photoMedium
                 , type: photoType
                 , thumbnail: thumbnail
                 }
              })
        currentPhoto = currentAlbum[0]
        $('body').append('<div class="gallery-photos">' +
                         '<button disabled type="button" class="arrow arrow-left"><i></i><i></i></button>' +
                         '<button disabled type="button" class="arrow arrow-right"><i></i><i></i></button>' +
                         '<div class="gallery-photos-main"></div>' +
                         '<div class="gallery-photos-carousel">' +
                         '<ul>' +
                         currentAlbum.reduce(function (str, photo) {
                           return str + '<li><img src=' + photo.thumbnail +
                                  ' data-photo-url=' + photo.url +
                                  ' data-photo-medium=' + photo.medium +
                                  ' data-photo-type=' + photo.type +
                                  '></li>'
                         }, '') +
                         '</ul></div></div>'
                        )
        // event binding is crap
        $(window).keyup(function (e) {
          if (e.keyCode === 27 && $('.gallery-photos')) // esc key
            $('.gallery-photos').remove()
        })
        $('.gallery-photos-carousel img').click(function () {
          var photoIndex = $(this).parent().index()
          currentPhoto = currentAlbum[photoIndex]
          $('.gallery-photos .arrow').prop('disabled', false)
          if (photoIndex === 0)
            $('.gallery-photos .arrow-left').prop('disabled', true)
          if (photoIndex === currentAlbum.length - 1)
            $('.gallery-photos .arrow-right').prop('disabled', true)
          displayPhoto(currentPhoto.url, currentPhoto.medium, currentPhoto.type)
          moveCarousel(photoIndex)
        })
        $('.gallery-photos .arrow-left').click(function () {
          var photoIndex = currentAlbum.indexOf(currentPhoto) - 1
          currentPhoto = currentAlbum[photoIndex]
          if ($('.gallery-photos .arrow-right').prop('disabled'))
            $('.gallery-photos .arrow-right').prop('disabled', false)
          if (photoIndex === 0)
            $(this).prop('disabled', true)
          displayPhoto(currentPhoto.url, currentPhoto.medium, currentPhoto.type)
          moveCarousel(photoIndex)
        })
        $('.gallery-photos .arrow-right').click(function () {
          var photoIndex = currentAlbum.indexOf(currentPhoto) + 1
          currentPhoto = currentAlbum[photoIndex]
          if ($('.gallery-photos .arrow-left').prop('disabled'))
            $('.gallery-photos .arrow-left').prop('disabled', false)
          if (photoIndex === currentAlbum.length - 1)
            $(this).prop('disabled', true)
          displayPhoto(currentPhoto.url, currentPhoto.medium, currentPhoto.type)
          moveCarousel(photoIndex)
        })
        $('.gallery-photos-carousel li:first-of-type img').click()
      })
    }

    // takes JSON data and creates a photo gallery
    function copyAlbums (data) {
      var albums = data.feed.entry
      el.gallery.append(albums.map(function (album) {
        var title = album.title.$t
          , thumbnail = album.media$group.media$thumbnail[0].url
          , albumid = album.id.$t.replace(/^.*albumid\/(.+)\?.*$/, '$1')
          , block = '<li class="gallery-album" ' +
                    'data-album-id="' + albumid + '">' +
                    '<img class="gallery-album-preview" ' +
                    'src="' + thumbnail + '">' +
                    '<span class="gallery-album-name">' + title +
                    '</span></li>'
        return block
      }))
      $('.gallery-album').click(function () {
        displayAlbum($(this).attr('data-album-id'))
      })
    }

    function init () {
      $.getJSON(albumsUrl).done(copyAlbums)
    }

    return { init: init
           , albumsUrl: albumsUrl
           }
  })()

  // do something :)
  greeting = { text: 'MVRT!!!'
             , init: function () { console.log(this.text) }
             }

  // do this when the document is ready
  $(document).ready(function () {
    greeting.init()
    home.init()
    if (gallery)
      gallery.init()
  })

})(jQuery, window, document)
