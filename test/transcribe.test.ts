import { transcribe } from '../transcribe'
const chineseSound = require('../lib/ChineseSound');
import { expect } from 'chai';
import 'mocha';

describe('Transcription function', () => {

  it('\"doll\" should return "TL => 迪尔 dí\'ěr,"', () => {
    chineseSound.loadRules().then(function() {
      const result = transcribe('doll');
      expect(result).to.equal("TL => 迪尔 dí\'ěr,");
    });
  });

});
