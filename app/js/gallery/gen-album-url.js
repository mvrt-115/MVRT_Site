var fmt = require('url').format

module.exports = function genAlbumUrl (options) {
  if (!options.user) throw new Error('Must have user.')
  if (!options.albumid) throw new Error('Must have album id.')
  return fmt({
    protocol: 'https',
    host: 'picasaweb.google.com',
    pathname: '/data/feed/base/user/' + options.user + '/albumid/' + options.albumid,
    query: {
      alt: options.format || 'json',
      thumbsize: options.thumbsize || 160,
      imgmax: options.imgmax || 1280
    }
  })
}
