const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const metaphone = natural.Metaphone;
const chineseSound = require('./ChineseSound');

const myArgs = process.argv.slice(2);
const arg1 = myArgs[0];

if (arg1 === undefined) {
  console.log('Enter the word you want to transcribe as an argument.');
  process.exit(1);
} else if (arg1 === '--help' || arg1 === '--h') {
  const absolutePathToMe = process.argv[1];
  const relativePathToMe = absolutePathToMe.substring(absolutePathToMe.lastIndexOf('/')+1);

  console.log(`For example: node ${relativePathToMe} \"dearest doll\"`);
  process.exit(0);
}

console.log(`Raw input was: ${arg1}`);

metaphone.attach();
const phonemes = arg1.tokenizeAndPhoneticize();
phonemes.forEach(function(value, key, phonemes) {
    const transcribed = chineseSound.toChineseSounds(value);
    let characters = [];
    let romans = [];

    transcribed.forEach(function(value, key, transcribed) {
      if (value !== null) {
        characters.push(value.zi);
        romans.push(value.pinyin);
      }
    });

    const transcribed_readable = characters.join("") + " " + romans.join("");
    console.log(`${value} => ${transcribed_readable}`);
});

