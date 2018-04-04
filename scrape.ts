const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  uri: `https://en.wikipedia.org/wiki/Template:Transcription_into_Chinese`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    let chineseTable = $('table.wikitable > tbody').first();
    chineseTable.children().each(function(index, element) {
      if (element.name === "tr") {
        console.log(element);       
      } else {
        console.log(`I expected tr but got ${element.name}`);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
