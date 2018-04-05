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
          const rowspan: number = $(this).attr("rowspan"); // e.g. 南 rowspan2: nʌn,nʌŋ 
          const colspan: number = $(this).attr("colspan"); // e.g. 夫/弗 colspan3: v-,w-,f-

          if (rowspan) console.log(`${textNoNewline} has rowspan ${rowspan}`);
          if (colspan) console.log(`${textNoNewline} has colspan ${colspan}`);

          soundObjects.push(new ChineseSound(initials[columnIndex] 
,           finals[rowIndex-2] //First row is title, second are initials
,           textNoNewline, pinyin(textNoNewline).join()));

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
