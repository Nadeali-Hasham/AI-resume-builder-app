import assert from 'node:assert/strict';

const buckets = new Map();
const check = (key, limit, windowMs) => {
  const now = Date.now();
  const bucket = buckets.get(key) || { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0 };
  }
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: limit - bucket.timestamps.length };
};

const key = `test-${Date.now()}`;
assert.equal(check(key, 2, 60_000).allowed, true);
assert.equal(check(key, 2, 60_000).allowed, true);
assert.equal(check(key, 2, 60_000).allowed, false);

console.log('rate-limit.test.mjs: ok');
