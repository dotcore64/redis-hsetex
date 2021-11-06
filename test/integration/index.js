import { createRequire } from 'module';
import Redis from 'ioredis';
import { setTimeout } from 'timers/promises';
import { use, expect } from 'chai';
import * as pdel from 'redis-pdel';

// https://github.com/import-js/eslint-plugin-import/issues/1649
// eslint-disable-next-line import/no-unresolved
import { lua, name, numberOfKeys } from 'redis-hsetex';

const require = createRequire(import.meta.url);
use(require('chai-as-promised'));

const keyPrefix = 'hsetex:test:';
const redis = new Redis({ keyPrefix });

redis.defineCommand(pdel.name, {
  lua: pdel.lua,
  numberOfKeys: pdel.numberOfKeys,
});

redis.defineCommand(name, {
  lua,
  numberOfKeys,
});

describe('integration', () => {
  beforeEach(() => redis.pdel('*'));
  after(() => redis.disconnect());

  describe('errors', () => {
    it('should fail when no keys are passed', () => expect(redis.hsetex('testhash', 1))
      .to.be.rejectedWith(Error, /Wrong number of args calling Redis/));
  });

  describe('single key', () => {
    beforeEach(() => expect(redis.hsetex('testhash', 1, 'foo', 'bar')).to.become(1));

    it('should not have expired yet', async () => {
      await setTimeout(100);

      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal('bar');
      expect(res[1][1]).to.be.lessThan(1000).and.greaterThan(500);
    });

    it('should have expired yet', async () => {
      await setTimeout(1000);
      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal(null);
      expect(res[1][1]).to.be.lessThan(0);
    }).slow(1200);
  });

  describe('multi keys', () => {
    beforeEach(() => expect(redis.hsetex('testhash', 1, 'foo', 'bar', 'baz', 'baq')).to.become(2));

    it('should not have expired yet', async () => {
      await setTimeout(100);

      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .hget('testhash', 'baz')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal('bar');
      expect(res[1][1]).to.equal('baq');
      expect(res[2][1]).to.be.lessThan(1000).and.greaterThan(500);
    });

    it('should have expired yet', async () => {
      await setTimeout(1000);
      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .hget('testhash', 'baz')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal(null);
      expect(res[1][1]).to.equal(null);
      expect(res[2][1]).to.be.lessThan(0);
    }).slow(1200);
  });
});
