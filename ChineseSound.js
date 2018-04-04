var ChineseSound = function(initial, final, zi, pinyin) {
    this.initial = initial;
    this.final = final;
    this.zi = zi;
    this.pinyin = pinyin;
};

const _b_ = new ChineseSound('b', null, '布', 'bù');
const _di = new ChineseSound('d', 'ɪ', '迪', 'dí');
const __r = new ChineseSound(null, 'r', '尔', 'ěr');
const __l = new ChineseSound(null, 'l', '尔', 'ěr');
const _is = new ChineseSound('ɪ', 's', '西', 'xī');
const __t = new ChineseSound(null, 't', '特', 'tè');
const _da = new ChineseSound('d', 'ɒ', '多', 'duō');

exports.toChineseSounds = function in_zh(token) {
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
};
