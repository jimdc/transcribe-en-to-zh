const chineseSound = require('../lib/ChineseSound');
import { expect } from 'chai';
import 'mocha';

describe('findChineseSounds test', () => {

  before(function() {
    return chineseSound.loadRules();
  });

  it('It finds duo1 (unique)', () => {
    const result = chineseSound.find('多')[0];
    expect(result.initialSound).to.equal('d');
    expect(result.finalSound).to.equal('ɒ, ɔː, oʊ');
  });

  it('It finds de2 (three versions)', () => {
    const results = chineseSound.find('德');
    expect(results.length).to.equal(3);
    results.forEach(function(element) {
      expect(element.initialSound).to.equal('d');
    });
  });

  it('It finds zi1 (unique, after colspan disruption)', () => {
    const result = chineseSound.find('兹')[0];
    expect(result.initialSound).to.equal('z / dz');
  });

  it('It finds shang4 (unique but colspan=2)', () => {
    const results = chineseSound.find('尚');
    expect(results.length).to.equal(2);
    results.forEach(function(element) {
      expect(element.initialSound).to.equal('ʃ');
    });
  });

  it('It finds the two sounds right after shang4', () => {
    const resultAen = chineseSound.find('詹');
    const resultAhn = chineseSound.find('章');
    expect(resultAen.initialSound).to.equal('dʒ');
    expect(resultAhn.initialSound).to.equal('dʒ');
    expect(resultAen.initialSound).to.equal('æn, ʌn, æŋ');
    expect(resultAhn.initialSound).to.equal('ɑn, aʊn, ʌŋ, ɔn, ɒn, ɒŋ');
  });

});

