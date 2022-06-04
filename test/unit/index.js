import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { dirname } from 'dirname-filename-esm';
import { expect } from 'chai';

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved,n/no-missing-import
import { name, lua, numberOfKeys } from 'redis-hsetex';

const hsetex = readFileSync(join(dirname(import.meta), '..', '..', 'src', 'hsetex.lua'), 'utf8');

describe('unit', () => {
  it('should export correct object literal from esm build', () => {
    expect(name).to.equal('hsetex');
    expect(lua).to.equal(hsetex);
    expect(numberOfKeys).to.equal(1);
  });
});
