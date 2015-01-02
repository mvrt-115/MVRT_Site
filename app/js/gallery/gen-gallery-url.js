var fmt = require('url').format

module.exports = function genGalleryUrl (options) {
  if (!options.user) throw new Error('Must have user.')
  return fmt({
    protocol: 'https',
    host: 'picasaweb.google.com',
    pathname: '/data/feed/base/user/' + options.user,
    query: {
      alt: options.format || 'json',
      thumbsize: options.thumbsize || 160
    }
  })
}
