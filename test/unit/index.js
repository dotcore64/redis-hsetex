const { join } = require('path');
const { expect } = require('chai');
const { readFileSync } = require('fs');

const { name, lua, numberOfKeys } = require('../..');

const hsetex = readFileSync(join(__dirname, '..', '..', 'src', 'hsetex.lua'), 'utf8');

describe('unit', () => {
  it('should export correct object literal', () => {
    expect(name).to.equal('hsetex');
    expect(lua).to.equal(hsetex);
    expect(numberOfKeys).to.equal(1);
  });
});
