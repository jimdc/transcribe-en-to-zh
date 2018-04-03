const rp = require('request-promise');
const cheerio = require('cheerio');

// Eventually this should spit out a JSON file with the transcription rules

const options = {
  uri: `https://en.wikipedia.org/wiki/Template:Transcription_into_Chinese`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    let chineseTable = $('table.wikitable').first();
    console.log(chineseTable.html());
  })
  .catch((err) => {
    console.log(err);
  });
