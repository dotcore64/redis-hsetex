import path from 'path';
import sinon from 'sinon';
import { expect } from 'chai';
import { readFileSync } from 'fs';

import { name, lua, numberOfKeys, install } from '../../lib';

const expectation = {
  name: 'hsetex',
  lua: readFileSync(path.join(__dirname, '..', '..', 'src', 'hsetex.lua'), 'utf8'),
  numberOfKeys: 1,
};

describe('unit', () => {
  it('should export correct object literal', () => {
    expect(name).to.equal(expectation.name);
    expect(lua).to.equal(expectation.lua);
    expect(numberOfKeys).to.equal(expectation.numberOfKeys);
  });

  it('should install command into ioredis', () => {
    const ioredis = {
      defineCommand: sinon.spy(),
    };

    install(ioredis);
    expect(ioredis.defineCommand.calledOnce).to.equal(true);
    expect(ioredis.defineCommand.firstCall.args).to.deep.equal([
      expectation.name,
      {
        lua: expectation.lua,
        numberOfKeys: expectation.numberOfKeys,
      },
    ]);
  });
});
