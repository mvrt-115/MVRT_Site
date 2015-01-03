console.log('dynamic');
var tagLocations = {};

function addContent(tag, link){
  tagLocations[tag] = link;
}

$('document').ready(function(){
  var hash = window.location.hash;
  if(hash === "")hash = tagLocations['#Overview'];
  var dir = tagLocations[hash];
  if(typeof dir === 'undefined')dir = tagLocations['#Overview'];
  setPage(dir);
});

function setPage(dir){
  $('#about-content').load(dir);
}
