const assert = require('assert');
const { getAttributeGroups, ATTRIBUTE_GROUPS } = require('../lib/attributeGroups');

(function testGetAll() {
  const all = getAttributeGroups();
  assert(Array.isArray(all), 'Expected an array');
  assert(all.length === ATTRIBUTE_GROUPS.length, 'Expected full list when no query');
})();

(function testQueryFilter() {
  const res = getAttributeGroups('seo');
  assert(res.length >= 1, 'Expected at least one match for "seo"');
  assert(res.some((g) => g.id === 'seo' || g.name.toLowerCase().includes('seo')),
    'Expected seo group to be present');
})();

console.log('attributeGroups tests passed');
