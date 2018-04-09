const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const pinyin = require('pinyin');
import ChineseSound from '../lib/ChineseSound';

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

    let realRowIndex: number = 0;
    let realColumnIndex: number = 0;

    chineseTable.each(function(loopRowIndex, rowElement) {

      if (loopRowIndex === 0) return; //like 'continue' but for each; not really a loop
      let loopColumnOffset: number = 0;

      $(this).children().each(function(loopColumnIndex, columnElement) {
        const textNoNewline = $(this).text().trim().replace(/[\r\n]+/g," ");

        if ((loopColumnIndex === 0) && (loopRowIndex !== 1)) { //idk why but rowColumnIndex did not work here
          console.log(`Pushing ${textNoNewline} to finals`);
          finals.push(textNoNewline);
        } else if (loopRowIndex === 1) {
          console.log(`Pushing ${textNoNewline} to initials`);
          initials.push(textNoNewline);
        } else {
          //rowspan x > 1 means: "create x sounds with the same initial, different finals": trickier.
          const rowspan: number = $(this).attr("rowspan"); // e.g. 南 rowspan2: nʌn,nʌŋ 
          if (rowspan) console.log(`${textNoNewline} has rowspan ${rowspan}`);

          //colspan x > 1 means: "create x sounds with the same final, different initials"
          const colspan: number = $(this).attr("colspan"); // e.g. 夫/弗 colspan3: v-,w-,f-
          if (colspan) {
            let differentInitials: string[] = [];

            console.log(`${textNoNewline} has colspan, so creating ${colspan} objects`);
            
            for(let i = 0; i < colspan; i++) {
              differentInitials.push(initials[loopColumnIndex+loopColumnOffset]);

              soundObjects.push(new ChineseSound(initials[loopColumnIndex+loopColumnOffset]
,             finals[loopRowIndex-2] //as usual
,             textNoNewline, pinyin(textNoNewline).join()));

              loopColumnOffset++; //to align it properly
            }
            loopColumnOffset--;

            console.log(`${textNoNewline} has colspan; creating ${colspan} objects with initials ${differentInitials.join(",")}`);
            soundSentence.push(textNoNewline);
            return; //avoid realColumnIndex++ since we already did it in the loop
          } else {
            soundObjects.push(new ChineseSound(initials[loopColumnIndex+loopColumnOffset] 
,             finals[loopRowIndex-2] //First row is title, second are initials
,             textNoNewline, pinyin(textNoNewline).join()));
          }

          soundSentence.push(textNoNewline);
        }

        realColumnIndex++;
      });

      console.log(`sS=${soundSentence.join()}`); //loopColumnIndex not accessible from here
      soundSentence = [];
      realRowIndex++;
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
