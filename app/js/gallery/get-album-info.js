/**
 * Gets album info
 *
 * @param {Array} albums An array of Google Data Pi...albums
 * @returns {Array}
 */
module.exports = function getAlbumInfo (albums) {
  return albums.map(function (album) {
    return {
      title: album.title.$t,
      thumb: album.media$group.media$thumbnail[0].url,
      id: album.id.$t.replace(/^.*albumid\/(.+)\?.*$/, '$1'),
      url: album.id
    }
  })
}
