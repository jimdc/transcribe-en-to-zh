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

});

