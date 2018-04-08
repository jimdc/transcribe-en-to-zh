// http://www.pinyin.info/romanization/hanyu/apostrophes.html
exports.join = function joinPinyin(syllables: string[], separator: string): string {
  const apostropheRequiredInitials: string = 'āáǎàaɑ̄ɑ́ɑ̌ɑ̀ɑēéěèeōóǒòo';
  let resultString: string = "";

  for(syllable of syllables) {
    if (!(typeof syllable === 'string')) continue;
    let initial = syllable.charAt(0);
    if (apostropheRequiredInitials.includes(initial)) {
      if (resultString.length !== 0) { //It's not the beginning of the word
        if (resultString[-1] !== '-') { //The previous syllable is not dash
          resultString += '\'';
        }
      }
    }
    resultString += syllable + separator;
  }

  return resultString;
};
