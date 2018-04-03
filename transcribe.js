const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const metaphone = natural.Metaphone;

const _b_ = {initial: 'b', final: null, zi: '布', pinyin: 'bù'};
const _di = {initial: 'd', final: 'ɪ', zi: '迪', pinyin: 'dí'};
const __r = {initial: null, final: 'r', zi: '尔', pinyin: 'ěr'};
const __l = {initial: null, final: 'l', zi: '尔', pinyin: 'ěr'};
const _is = {initial: 'ɪ', final: 's', zi: '西', pinyin: 'xī'};
const __t = {initial: null, final: 't', zi: '特', pinyin: 'tè'};
const _da = {initial: 'd', final: 'ɒ', zi: '多', pinyin: 'duō'};

const dearest_ipa = 'ˈdɪɹɪst';
const doll_ipa = 'dɒl';

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

//dearest doll --> TRST_TL
function in_zh(token) {
  let result = [];
  for(let i = 0; i < token.length; i++) {
    //Yeah, this is per-token not per-phoneme. Something to fix.
    const is_initial = (i == 0);
    const is_final = (i == token.length);
    switch(token.charAt(i)) {
      case "T": 
        if (is_initial) result.push(_di); 
        else if (is_final) result.push(__t); 
        else result.push(null);
        break;
      case "S":
        result.push(_is);
        break;
      case "R":
      case "L":
        result.push(__r);
        break;
      default: 
        result.push(null);
    }
  }
  return result;
}

metaphone.attach();
const phonemes = arg1.tokenizeAndPhoneticize();
phonemes.forEach(function(value, key, phonemes) {
    const transcribed = in_zh(value);
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

/*
const zh = in_zh(arg1);
if (zh !== null) {
  console.log(`It may be transcribed as ${zh[0]} (${zh[1]})`);
}*/
