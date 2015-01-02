var $ = require('jquery')

var elements = module.exports = {

  $gallery: $('.gallery'),
  $album: $('.gallery-album'),
  $photos: $('.gallery-photos'),
  $main: $('.gallery-photos-main'),
  $carousel: $('.gallery-photos-carousel ul'),
  $carouselThumb: $('.gallery-photos-carousel img'),

  $arrow: $('.gallery-photos .arrow'),
  $arrowLeft: $('.gallery-photos .arrow-left'),
  $arrowRight: $('.gallery-photos .arrow-right'),

  $firstInCarousel: $('.gallery-photos-carousel li:first-of-type img')

}
