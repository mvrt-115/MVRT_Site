var url = require('url')
  , path = require('path')

const PROTOCOL = 'https'
const HOST = 'picasaweb.google.com'
const BASE_PATH = '/data/feed'
const QUERY = { alt: 'json', imgmax: '1600', thumbsize: '160c' }
const DEFAULT_PROJECTION = 'base'
const PARAMETERS = /^(?:access|bbox|fields|imgmax|kind|l|max-results|prettyprint|q|start-index|tag|thumbsize)$/

/**
 * Returns a Picasa Web Album API URL, JSON style
 * NOTE: It only supports user, album, and photo data.
 * @param {object} options Options, such as userId, albumId, photoId, query parameters
 * @returns {string} The Picasa API URL
 */
module.exports = function picasaUrl (options) {
  if (!options) throw new Error('no options')
  if (!options.userId) throw new Error('no userid')
  if (!options.albumId && options.photoId) throw new Error('no albumid')
  let pathname = path.join(BASE_PATH, options.projection || DEFAULT_PROJECTION)
    , query = Object.assign(QUERY, filter(options, (val, param) => PARAMETERS.test(param)))
  if (options.userId) {
    pathname = path.join(pathname, 'user', options.userId)
    if (options.albumId) {
      pathname = path.join(pathname, 'albumid', options.albumId)
      if (options.photoId) {
        pathname = path.join(pathname, 'photoid', options.photoId)
      }
    }
  }
  return url.format({
    protocol: PROTOCOL,
    host: HOST,
    pathname,
    query
  })
}

function filter (obj, fn) {
  var result = {}
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (fn(obj[prop], prop, obj)) {
        result[prop] = obj[prop]
      }
    }
  }
  return result
}
