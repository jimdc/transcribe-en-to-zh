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
    let chineseTable = $('table.wikitable').first().find('>tbody>tr>td');
    let soundSentence: string[] = [];
    chineseTable.each(function(index, element) {
      if (index%27 === 0) {
        console.log(soundSentence.join());
        soundSentence = [];
      } else {
        soundSentence.push($(this).text().trim());
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
