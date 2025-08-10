const assert = require('assert');
const { queryAttributeGroups, ATTRIBUTE_GROUPS } = require('../lib/attributeGroups');

// Basic unit tests for the attribute groups query helper
(function run() {
  // returns all by default
  const all = queryAttributeGroups();
  assert(Array.isArray(all), 'Expected an array');
  assert.strictEqual(all.length, ATTRIBUTE_GROUPS.length, 'Expected full list');

  // filter by attribute code
  const pricing = queryAttributeGroups({ q: 'price' });
  assert(pricing.find((g) => g.id === 'pricing'), 'Expected pricing group to be present when filtering by price');

  // respects limit
  const limited = queryAttributeGroups({ limit: 1 });
  assert.strictEqual(limited.length, 1, 'Expected limit to be applied');

  // case-insensitive search by group name
  const seo = queryAttributeGroups({ q: 'SeO' });
  assert(seo.length >= 1 && seo[0].id === 'seo', 'Expected to find SEO group case-insensitively');
})();

console.log('attribute-groups tests: ok');
