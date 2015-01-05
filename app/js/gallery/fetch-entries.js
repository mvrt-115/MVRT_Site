var $ = require('jquery')

/**
 * Fetch Picasa feed.
 *
 * @param {string} url A Google Data URL to fetch.
 * @param {entryCallback} cb Callback
 */
module.exports = function fetchEntries (url, cb) {
  $.getJSON(url)
    .done(function (data) {
      cb(null, data.feed.entry)
    })
    .fail(function (jqXHR, textStatus, err) {
      cb(err)
    })
}

/**
 * Callback for fetchEntries
 *
 * @callback entryCallback
 * @param {Error} err Error, if any
 * @param {Array} data An array of the entries
 */
