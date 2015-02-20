var yaml = require('js-yaml')
  , Octokat = require('octokat')
  , slug = require('to-slug-case')
  , $ = require('jquery')
  , dateformat = require('dateformat')

exports.init = init

const GH_TOKEN = process.env.GH_TOKEN
const GH_USER = process.env.GH_USER
const GH_REPO = process.env.GH_REPO
const GH_BRANCH = 'master'
const POSTS_PATH = 'app/_posts'

let octo = new Octokat({ token: GH_TOKEN })
let $btn = $('[name="post"] button')

function init () {
  bindUIEvents()
}

function bindUIEvents () {
  $btn
    .click(() => {
      $btn.prop('disabled', true).text('Submitting...')
      let content = {
        title: $('#post-title').val(),
        author: $('#post-author').val(),
        categories: $('#post-categories').val(),
        text: $('#post-text').val()
      }
      post(content)
    })
    .on('success', () => $btn.text('Submitted.'))
    .on('failure', () => $btn.text('Failed.'))
}

/**
 * Creates the Blob content.
 * @param {Object} options={} { title, author, text, categories }
 * @returns {String} Blob content.
 */
function createBlobContent (options = {}) {
  if (!options.title) throw new Error('no title')
  if (!options.author) throw new Error('no author')
  if (!options.text) throw new Error('no text')
  let front = yaml.safeDump({
        title: options.title.trim(),
        author: options.author.trim(),
        categories: options.categories.trim().split(' ').filter(cat => cat.length),
        date: dateformat('isoDateTime')
      })
    , text = options.text.trim()
  return `---\n${front}---\n${text}\n`
}

/**
 * Creates the Blob filename.
 * @param {String} title The title
 * @returns {String}
 */
function createBlobFilename (title) {
  if (!title) throw new Error('no title')
  return `${POSTS_PATH}/${dateformat('isoDate')}-${slug(title)}.md`
}

/**
 * Creates the post branch name.
 * @param {String} title The title
 * @returns {String}
 */
function createBranchName (title) {
  if (!title) throw new Error('no title')
  return `post-${slug(title)}`
}

/**
 * Creates the commit message.
 * @param {String|Object} title Title or options object
 * @param {String=} author Optional author
 * @returns {String} The commit message.
 */
function createCommitMessage (title = {}, author = null) {
  if (typeof title === 'object') {
    author = title.author || null
    title = title.title || null
  }
  if (!title) throw new Error('no title')
  return `Blog post "${title}"${ author ? '\n\nBy ' + author : '' }`
}

/**
 * Creates the author field.
 * NOTE: It only returns the first author
 * NOTE: Email is some arbituary name@mvrt.com
 * @param {Object|String} name author or { name, email }
 * @param {String=} email Optional email
 * @returns {Object} { name, email }, cleaned
 */
function createAuthor (name = {}, email = null) {
  if (typeof name === 'object') {
    email = name.email || null
    name = name.name || null
  }
  if (!name) throw new Error('no author')
  name = name.trim().split(',')[0].trim()
  email = email || name.toLowerCase().replace(/\s/g, '.') + '@mvrt.com'
  return { name, email }
}

/**
 * Uploads the new post to Github.
 * @param {Object} options { title, author, text, categories }
 */
function post (options) {
  let repo, branch, filename, message, content, author
  try {
    repo = octo.repos(GH_USER, GH_REPO)
    branch = createBranchName(options.title)
    filename = createBlobFilename(options.title)
    message = createCommitMessage(options)
    content = createBlobContent(options)
    author = createAuthor(options.author)
  } catch (e) { handleerr(e) ; return }
  // To branch we need to get the sha of master and create a new ref from it
  repo.git.refs(`heads/${GH_BRANCH}`).fetch()
    .then(data => data.object.sha)
    .then(sha => repo.git.refs.create({ sha: sha, ref: `refs/heads/${branch}` }))
    // Commit the new blog entry
    .then(() => repo.contents(filename).add({ message, author, branch, content: btoa(content) }))
    // Merge the post branch into master
    .then(() => repo.merges.create({ base: 'master', head: branch }))
    // Merge master into develop
    .then(() => repo.merges.create({ base: 'develop', head: 'master' }))
    // Old method was to merge post branch into both branches, but that leaves weird marks
    //.then(co.wrap(function *() {
    //  let head = branch
    //  return yield ['master', 'develop'].map(base => repo.merges.create({ base, head }))
    //}))
    // Delete the old branch
    .then(() => repo.git.refs(`heads/${branch}`).remove())
    // If success, success
    .then(() => $btn.trigger('success'))
    // Boo :(
    .then(null, handleerr)
}

/**
 * Handle errors.
 * @param {Error} err The error.
 */
function handleerr (err) {
  console.error(err)
  $btn.trigger('failure')
}
