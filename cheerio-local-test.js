var cheerio = require("cheerio");
var html = "<ul><li>foo</li><li>bar</li></ul>";
var $ = cheerio.load(html);
var list = $("ul");

console.log(list.html());
