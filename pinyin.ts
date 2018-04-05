// http://www.pinyin.info/romanization/hanyu/apostrophes.html
exports.clean = function cleanPinyin(pinyin: string): string {
  var erIndex: number = pinyin.indexOf('ěr');
  if (erIndex > 1) {
    return pinyin.replace('ěr', '\'ěr');
  }

  return pinyin;
};
