import Redis from 'ioredis';
import Promise from 'bluebird';
import { expect } from 'chai';
import { install as pdel } from 'redis-pdel';
import { install as hsetex } from '../../lib';

describe('integration', () => {
  const keyPrefix = 'hsetex:test:';
  const redis = new Redis({ keyPrefix });
  pdel(redis);
  hsetex(redis);

  beforeEach(async () => {
    await redis.pdel('*');

    const res = await redis.hsetex('testhash', 1, 'foo', 'bar');
    expect(res).to.equal(1);
  });

  after(async () => {
    await redis.disconnect();
  });

  it('should not have expired yet', async () => {
    await Promise.delay(100);

    const res = await redis
      .multi()
      .hget('testhash', 'foo')
      .pttl('testhash')
      .exec();

    expect(res[0][1]).to.equal('bar');
    expect(res[1][1]).to.be.lessThan(1000).and.greaterThan(500);
  });

  it('should have expired yet', async function() {
    this.slow(1100);

    await Promise.delay(1000);
    const res = await redis
      .multi()
      .hget('testhash', 'foo')
      .pttl('testhash')
      .exec();

    expect(res[0][1]).to.equal(null);
    expect(res[1][1]).to.be.lessThan(0);
  });
});
