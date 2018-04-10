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

    let loopRowOffset: number = 0;
    let loopRowOffsetAfter: number = 0; //apply the loopRowOffset after reaching this column/initial

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
          let initialsIndex = loopColumnIndex+loopColumnOffset;
          //rowspan x > 1 means: "create x sounds with the same initial, different finals"
          const rowspan: number = $(this).attr("rowspan"); // e.g. 南 rowspan2: nʌn,nʌŋ 
          if (rowspan) {
            console.log(`${textNoNewline} has rowspan, so creating ${rowspan} objects`);

            //The finals array hasn't been built yet, so we just put in the desired index for later.
            for(let i = 0; i < rowspan-1; i++) {
              let newSound: ChineseSound = new ChineseSound(initials[initialsIndex], null, textNoNewline, pinyin(textNoNewline).join());
              newSound.pendingFinalSound = i + (loopRowIndex-2); // If you change finalsIndex, you might have to change this
              soundObjects.push(newSound);
            }

            loopRowOffset = rowspan;
            loopRowOffsetAfter = initialsIndex;
            console.log(`Set loopRowOffset of ${loopRowOffset}; loopRowOffsetAfter = ${loopRowOffsetAfter}`);
          }

          let finalsIndex = loopRowIndex-2; //First row is title, second is for initials
          //colspan x > 1 means: "create x sounds with the same final, different initials"
          const colspan: number = $(this).attr("colspan"); // e.g. 夫/弗 colspan3: v-,w-,f-
          if (colspan) {
            let differentInitials: string[] = [];

            console.log(`${textNoNewline} has colspan, so creating ${colspan} objects`);
            
            for(let i = 0; i < colspan; i++) {
              differentInitials.push(initials[loopColumnIndex+loopColumnOffset]);
              soundObjects.push(new ChineseSound(initials[initialsIndex], finals[finalsIndex], textNoNewline, pinyin(textNoNewline).join()));
              loopColumnOffset++; //to align it properly
            }

            loopColumnOffset--;

            console.log(`${textNoNewline} has colspan; creating ${colspan} objects with initials ${differentInitials.join(",")}`);
          } else { //does not have colspan. It's the default case for if there is no special rowspan either
            soundObjects.push(new ChineseSound(initials[initialsIndex], finals[finalsIndex], textNoNewline, pinyin(textNoNewline).join()));
          }

          soundSentence.push(textNoNewline);
        }

      });

      console.log(soundSentence.join());
      soundSentence = [];
    });

    console.log("initials: " + initials.join());
    console.log("finals: " + finals.join());

    soundObjects.forEach(function(element: ChineseSound) {
      if (element.pendingFinalSound) {
        const resolvedFinalSound = finals[element.pendingFinalSound];
        console.log(`Found pendingFinalSound idx ${element.pendingFinalSound} for ${element.zi}, resolving to ${resolvedFinalSound}`);
        element.finalSound = resolvedFinalSound;
        element.pendingFinalSound = undefined; // so it doesn't show up in the JSON file
      }
    });

    const stringified = JSON.stringify(soundObjects, null, 2);
    fs.writeFile('zh-rules.json', stringified, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  })
  .catch((err) => {
    console.log(err);
  });
