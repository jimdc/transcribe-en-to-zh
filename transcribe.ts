const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const metaphone = natural.Metaphone;
const chineseSound = require('./ChineseSound');
const pinyin = require('./pinyin');

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

console.log(`Raw input was: ${arg1}`);

metaphone.attach();
const phonemes: string[] = arg1.tokenizeAndPhoneticize();
phonemes.forEach(function(value, key, phonemes) {
    const transcribed: ChineseSound[] = chineseSound.toChineseSounds(value);
    let characters: string[] = [];
    let romans: string[] = [];

    transcribed.forEach(function(value, key, transcribed) {
      if (value !== null) {
        characters.push(value.zi);
        romans.push(value.pinyin);
      }
    });

    const transcribed_readable: string = characters.join("") + " " + pinyin.join(romans, "");
    console.log(`${value} => ${transcribed_readable}`);
});

