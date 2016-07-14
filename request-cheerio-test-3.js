var fs = require('fs');
var util = require('util');
var request = require("request");
var cheerio = require("cheerio");
var pd = require('pretty-data').pd; // http://www.eslinstructor.net/pretty-data/
var category = "cpg";

var beginningOfOPMLFile = '<?xml version="1.0" encoding="UTF-8"?>\
<opml version="1.0">\
 <head>\
  <title>blueraider55 subscriptions in Aol Reader</title>\
 </head>\
 <body>\
  <outline title="Computer Gigs" text="Computer Gigs">';

var endOfOPMLFile = '  </outline>\
 </body>\
</opml>\
';

request({
  uri: "https://www.craigslist.org/about/sites",
}, function(error, response, body) {
  var $ = cheerio.load(body);

  $(".box h4").each(function(i, item) {
    var h4 = $(this);
    var state = h4.text();
    var ul = h4.next();
    var items = '';
    ul.find('a').each(function() {
      var link = $(this);
      var cityName = link.text();
      var cityURL = link.attr("href");
      if (cityURL.substring(0,2) == "//") {
        cityURL = "https:" + cityURL;
      }
      items +=
        '   <outline title="' +
        state + ' - ' + cityName + '" text="' + state + ' - ' + cityName + '" type="rss" ' +
        'xmlUrl="' + cityURL + 'search/' + category + '?format=rss" ' +
        'htmlUrl="' + cityURL + 'search/' + category + '"/>';
    });
/*
<outline title="Pennsylvania - Altoona" text="Pennsylvania - Altoona" type="rss" xmlUrl="https://altoona.craigslist.org/search/cpg?format=rss" htmlUrl="https://altoona.craigslist.org/search/cpg"/>
*/
    var xml_pp = pd.xml(beginningOfOPMLFile + items + endOfOPMLFile);
    var log_file = fs.createWriteStream(__dirname + '/opml/' + state.replace('/','-') + '.opml', {flags : 'w'});
    log_file.write(util.format(xml_pp) + '\n');
  });
});
