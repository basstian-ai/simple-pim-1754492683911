/*
  Minimal test that can be run with: `node tests/attributeGroups.test.js`
  This avoids introducing new dev dependencies while still asserting core behavior.
*/

const assert = require('assert');
const { getAttributeGroups, findAttributeGroup, listAllAttributesFlat } = require('../lib/attributeGroups');

(function run() {
  const groups = getAttributeGroups();
  assert(Array.isArray(groups), 'getAttributeGroups should return an array');
  assert(groups.length >= 1, 'should expose at least one attribute group');
  const core = findAttributeGroup('core');
  assert(core && core.name === 'Core', 'findAttributeGroup should resolve by id');
  assert(Array.isArray(core.attributes) && core.attributes.some(a => a.code === 'name'), 'core group should contain name attribute');
  const flat = listAllAttributesFlat();
  assert(flat.length >= core.attributes.length, 'flattened list should be >= largest group');
  assert(flat.every(a => a.groupId && a.code && a.type), 'flattened attributes should expose basic fields');
  console.log('OK attributeGroups.test.js');
})();
