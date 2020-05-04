const Redis = require('ioredis');
const delay = require('delay');
const { use, expect } = require('chai');
const pdel = require('redis-pdel');

const hsetex = require('../..');

use(require('chai-as-promised'));

const keyPrefix = 'hsetex:test:';
const redis = new Redis({ keyPrefix });

redis.defineCommand(pdel.name, {
  lua: pdel.lua,
  numberOfKeys: pdel.numberOfKeys,
});

redis.defineCommand(hsetex.name, {
  lua: hsetex.lua,
  numberOfKeys: hsetex.numberOfKeys,
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
      await delay(100);

      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal('bar');
      expect(res[1][1]).to.be.lessThan(1000).and.greaterThan(500);
    });

    it('should have expired yet', async () => {
      await delay(1000);
      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal(null);
      expect(res[1][1]).to.be.lessThan(0);
    });
  }).slow(1100);

  describe('multi keys', () => {
    beforeEach(() => expect(redis.hsetex('testhash', 1, 'foo', 'bar', 'baz', 'baq')).to.become(2));

    it('should not have expired yet', async () => {
      await delay(100);

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
      await delay(1000);
      const res = await redis
        .multi()
        .hget('testhash', 'foo')
        .hget('testhash', 'baz')
        .pttl('testhash')
        .exec();

      expect(res[0][1]).to.equal(null);
      expect(res[1][1]).to.equal(null);
      expect(res[2][1]).to.be.lessThan(0);
    });
  }).slow(1100);
});
