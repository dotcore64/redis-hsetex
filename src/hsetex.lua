--!/usr/bin/env lua

local res = redis.call("HSET", KEYS[1], ARGV[2], ARGV[3])
redis.call("EXPIRE", KEYS[1], ARGV[1])

return res
