/**
 * Gets photo info
 *
 * @param {Array} photos An array of Photos
 * @returns {Array}
 */
module.exports = function getPhotoInfo (photos) {
  return photos.map(function (photo) {
    // we need to use a helpers library like LoDash or Ramda
    photo = photo.media$group
    var content = photo.media$content[photo.media$content.length - 1]
    return {
      url: content.url,
      medium: content.medium,
      mimeType: content.type,
      thumb: photo.media$thumbnail[0].url
    }
  })
}
