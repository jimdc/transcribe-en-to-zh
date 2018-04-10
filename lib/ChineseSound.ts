const {promisify} = require('util')
const fs = require('fs')
const path = require('path')
const pinyin = require('pinyin');
const readFileAsync = promisify(fs.readFile)

class ChineseSound {
  readonly initialSound: string;
  private _finalSound: string;
  public pendingFinalSound: number;
  readonly zi: string;
  readonly pinyin: string;

  constructor(initialSound: string, finalSound: string, zi: string, pinyin: string) {
    this.initialSound = initialSound;
    this._finalSound = finalSound;
    this.zi = zi;
    this.pinyin = pinyin;

    Object.defineProperties(this, { //done this way instead of normal get/set so finalSound, not _finalSound written in JSON.stringify
        _finalSound: {writable: true, enumerable: false},
        finalSound: {
            get: function () { return this._finalSound; },
            set: function (finalSound: string) { 
              if (!this.pendingFinalSound) { console.warn(`Setting finalSound for ${this.zi} without pendingFinalSound! Use constructor instead.`); }
              if (this._finalSound !== null) { console.warn(`Overwriting finalSound ${this._finalSound} for ${this.zi} with ${newFinalSound}.`); }
              this._finalSound = finalSound; 
            },
            enumerable: true
        }
    });
  }
}

const _b_: ChineseSound = new ChineseSound('b', null, '布', 'bù');
var _di: ChineseSound = null; // new ChineseSound('d', 'ɪ', '迪', 'dí');  
const __r: ChineseSound = new ChineseSound(null, 'r', '尔', 'ěr');
const __l: ChineseSound = new ChineseSound(null, 'l', '尔', 'ěr');
const _is: ChineseSound = new ChineseSound('ɪ', 's', '西', 'xī');
const __t: ChineseSound = new ChineseSound(null, 't', '特', 'tè');
let _da: ChineseSound = null; // new ChineseSound('d', 'ɒ', '多', 'duō');

let rules: ChineseSound[] = [];

exports.find = function findChineseSounds(character: string): ChineseSound[] {
  return rules.filter(function(element) { return element.zi == character; });
}

exports.loadRules = function loadRules(): Promise {
  let rulesPromise: Promise = readFileAsync(path.join(__dirname, '..', 'build', 'zh-rules.json'), {encoding: 'utf8'})
    .then(contents => {
      rules = JSON.parse(contents);
      _di = exports.find('迪')[0];
      _da = exports.find('多')[0];
    })
    .catch(error => {
      throw error;
    })
  return rulesPromise;
}

exports.toChineseSounds = function in_zh(token: string): ChineseSound[] {
  let result: ChineseSound[] = [];
  for(let i: number = 0; i < token.length; i++) {
    //Yeah, this is per-token not per-phoneme. Something to fix.
    const is_initial: boolean = (i == 0);
    const is_final: boolean = (i == token.length-1);
    switch(token.charAt(i)) {
      case "T":
        if (is_initial) {
          result.push(_di);
        } else if (is_final) {
          result.push(__t);
        } else { 
          result.push(null);
        }
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

export default ChineseSound;
