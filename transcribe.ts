const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const metaphone = natural.Metaphone;
const chineseSound = require('./lib/ChineseSound');
const pinyin = require('./lib/pinyin');

const myArgs: string[] = process.argv.slice(2);
const arg1: string = myArgs[0];

if (arg1 === undefined) {
  console.log('Enter the word you want to transcribe as an argument.');
  process.exit(1);
} else if (arg1 === '--help' || arg1 === '--h') {
  const absolutePathToMe: string = process.argv[1];
  const relativePathToMe: string = absolutePathToMe.substring(absolutePathToMe.lastIndexOf('/')+1);

  console.log(`For example: node ${relativePathToMe} \"dearest doll\"`);
  process.exit(0);
}

// Call metaphone.attach() before calling transcribe() !
export function transcribe(sentence: string): string {
  const phonemes: string[] = sentence.tokenizeAndPhoneticize();
  let result: string = "";

  phonemes.forEach(function(metaphoneValue, key, phonemes) {
    const transcribed: ChineseSound[] = chineseSound.toChineseSounds(metaphoneValue);
    let characters: string[] = [];
    let romans: string[] = [];

    transcribed.forEach(function(chineseSoundValue, key, transcribed) {
      if (chineseSoundValue !== null) {
        characters.push(chineseSoundValue.zi);
        romans.push(chineseSoundValue.pinyin);
      }
    });

    const transcribed_readable: string = characters.join("") + " " + pinyin.join(romans, "");
    result += `${metaphoneValue} => ${transcribed_readable}, `;
  });

  return result.trim();
}

metaphone.attach();
console.log(`Raw input was: ${arg1}`);

chineseSound.loadRules().then(function() {
  let arg1_transcribed: string = transcribe(arg1);
  console.log(arg1_transcribed);
});
