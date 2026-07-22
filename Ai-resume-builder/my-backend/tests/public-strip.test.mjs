/**
 * Pure helpers used by auth / public responses — no Strapi boot required.
 */
import assert from 'node:assert/strict';

const toPublic = (entity) => {
  const { userEmail, userName, ...rest } = entity;
  return rest;
};

const publicData = toPublic({
  title: 'Dev',
  userEmail: 'secret@example.com',
  userName: 'Secret',
  shareToken: 'abc',
});

assert.equal(publicData.userEmail, undefined);
assert.equal(publicData.userName, undefined);
assert.equal(publicData.shareToken, 'abc');

console.log('public-strip.test.mjs: ok');
