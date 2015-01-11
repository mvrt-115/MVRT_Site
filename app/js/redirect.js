module.exports = redirect

// paths to migrate
var paths = {

  'first': '/about/',
  'games': '/about/#Robot Game',
  'ultimateascent': '/about/#Robot Game',
  'reboundrumble': '/about/#Robot Game',
  'logomotion': '/about/#Robot Game',
  'breakaway': '/about/#Robot Game',
  'lunacy': '/about/#Robot Game',
  'overdrive': '/about/#Robot Game',
  'racknroll': '/about/#Robot Game',
  'manuals': '/about/#Robot Game',

  'team': '/about/',
  'history': '/about/#Team History',
  'eltoro': '/about/#Robots',
  'awards': '/about/#Team History',
  'outreach': '/about/#Outreach',
  'firstoutreach': '/about/#Outreach',
  'localoutreach': '/about/#Outreach',
  'internationaloutreach': '/about/#Outreach',
  'sponsorinvolvement': '/about/#Outreach',
  'girlsengineer': '/about/#Outreach',
  'sponsors': '/about/sponsors',
  'members': '/about/people/',
  'officers': '/about/people/#officers',
  'alumni': '/about/people/alumni/',
  'projectleads': '/about/people/', // TODO project leads section?
  'mentors': '/about/people/#mentors',
  'divisions': '/about/#Divisions',
  'blog': '/blog/',

  'joinmvrt2': '/join/',
  'bulletin': '/blog/',
  'events': '/blog/',
  'newsletters': '/blog/',
  'calendar': '/members/calendar/',
  'parents': '/members/parents/',
  'scholarships': '/members/scholarships/',
  'snackschedule': '/members/snackschedule/',
  'competitions': '/members/competitions/',

  'gallery': '/media/gallery/',
  'videos': '/media/videos/',
  'publicity': '/media/publicity/',
  'animations': '/media/animations/',
  'website': '/media/website/',

  'firstaidkit': '/resources/firstaidkit/',
  'generalmanagement': '/resources/firstaidkit/#general',
  'build': '/resources/firstaidkit/#build',
  'electrical': '/resources/firstaidkit/#electrical',
  'parts': '/resources/firstaidkit/#parts',
  'chairmans': '/resources/firstaidkit/#chairmans',
  'finance': '/resources/firstaidkit/#finance',
  'media': '/resources/firstaidkit/#media',
  'trainings': '/resources/trainings/',
  'documents': '/resources/documents/',
  'videoresources': '/resources/videos/',
  'links': '/resources/links/',
  'contact': '/contact/'

}

// redirects if there is a corresponding page to redirect to
function redirect () {
  var path = location.search.toLowerCase().replace(/^\?/, '')
  if (paths[path]) location.href = paths[path]
}

