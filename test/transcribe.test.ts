import { transcribe } from '../transcribe'
import { expect } from 'chai';
import 'mocha';

describe('Transcription function', () => {

  it('\"doll\" should return "TL => 迪尔 dí\'ěr, "', () => {
    const result = transcribe('doll');
    expect(result).to.equal("TL => 迪尔 dí\'ěr, ");
  });

});
