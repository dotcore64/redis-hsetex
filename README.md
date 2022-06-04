# redis-hsetex

[![Build Status][build-badge]][build]
[![npm package][npm-badge]][npm]

> hsetex lua command for redis clients

## hsetex redis command

Sets the value of a hash key and updates the expire date at the same time.

```
HSETEX key 1 firstname walter lastname white
```

In the example above, key `key` expires in 1 second.

## Install

```
$ npm install --save redis-hsetex
```

## Usage

The easiest usecase is to use with [https://github.com/luin/ioredis](ioredis) as follows:

```js
const Redis = require('ioredis');
const hsetex = require('redis-hsetex');
const redis = new Redis();
redis.defineCommand(hsetex.name, {
  lua: hsetex.lua,
  numberOfKeys: hsetex.numberOfKeys,
})
```

Then, just run like any other command:

```js
redis.hsetex('heisenberg', 1, 'firstname', 'walter');
redis.hsetex('heisenberg', 1, 'lastname', 'white');
redis.hsetex('saul_goodman', 1, 'firstname', 'jimmy', 'lastname', 'mcgill');
setTimeout(() => redis.hgetall('heisenberg'), 1100); // At this point, null is returned
```

## Tests

There are unit tests and integration tests.

```bash
docker-compose up
npm test:unit
npm test:integration
npm test # run both tests
```

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/github/workflow/status/dotcore64/redis-hsetex/test/master?style=flat-square
[build]: https://github.com/dotcore64/redis-hsetex/actions

[npm-badge]: https://img.shields.io/npm/v/redis-hsetex.svg?style=flat-square
[npm]: https://www.npmjs.org/package/redis-hsetex
