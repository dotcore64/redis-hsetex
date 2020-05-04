--!/usr/bin/env lua

local expire = table.remove(ARGV, 1)
local result = redis.call("HSET", KEYS[1], unpack(ARGV))
redis.call("EXPIRE", KEYS[1], expire)

return result
