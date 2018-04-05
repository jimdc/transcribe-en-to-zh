const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const pinyin = require('pinyin');
import ChineseSound from './ChineseSound';

const options = {
  uri: `https://en.wikipedia.org/wiki/Template:Transcription_into_Chinese`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    let chineseTable = $('table.wikitable').first().find('>tbody>tr');
    let initials: string[] = []
    let finals: string[] = []
    let soundSentence: string[] = [];
    let soundObjects: ChineseSound[] = [];
    chineseTable.each(function(rowIndex, rowElement) {

      if (rowIndex === 0) return; //Equivalent of "continue" in "each" (It's just the title)

      $(this).children().each(function(columnIndex, columnElement) {
        const textNoNewline = $(this).text().trim().replace(/[\r\n]+/g," ");

        if ((columnIndex === 0) && (rowIndex !== 1)) {
          finals.push(textNoNewline);
        } else if (rowIndex === 1) {
          initials.push(textNoNewline);
        } else {
          soundObjects.push(new ChineseSound(initials[columnIndex+1] 
,           finals[rowIndex-2] //First row is title, second are initials
,           textNoNewline, pinyin(textNoNewline)));

          soundSentence.push(textNoNewline);
        }
      });

      console.log(soundSentence.join());
      soundSentence = [];
    });
    console.log("initials: " + initials.join());
    console.log("finals: " + finals.join());

    const stringified = JSON.stringify(soundObjects, null, 2);
    fs.writeFile('zh-rules.json', stringified, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  })
  .catch((err) => {
    console.log(err);
  });
