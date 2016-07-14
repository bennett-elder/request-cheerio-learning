var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/test.opml', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
//   log_stdout.write(util.format(d) + '\n');
};
var request = require("request");
var cheerio = require("cheerio");

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

console.log(beginningOfOPMLFile);

request({
  uri: "https://www.craigslist.org/about/sites",
}, function(error, response, body) {
  var $ = cheerio.load(body);

  $(".box h4").each(function(i, item) {
    var h4 = $(this);
    var state = h4.text();
//     console.log(state);
    var ul = h4.next();
    ul.find('a').each(function() {
      var link = $(this);
      var cityName = link.text();
      var cityURL = link.attr("href");
      if (cityURL.substring(0,2) == "//") {
        cityURL = "https:" + cityURL;
      }
      console.log(
        '   <outline title="' +
        state + ' - ' + cityName + '" text="' + state + ' - ' + cityName + '" type="rss" ' +
        'xmlUrl="' + cityURL + 'search/' + category + '?format=rss" ' +
        'htmlUrl="' + cityURL + 'search/' + category + '"/>'
      );
    });
    /*
<outline title="Pennsylvania - Altoona" text="Pennsylvania - Altoona" type="rss" xmlUrl="https://altoona.craigslist.org/search/cpg?format=rss" htmlUrl="https://altoona.craigslist.org/search/cpg"/>

<outline title="state - cityName" text="state - cityName" type="rss" xmlUrl="cityURLsearch/cpg?format=rss" htmlUrl="cityURL/search/cpg"/>
    */
  });

  console.log(endOfOPMLFile);
});
