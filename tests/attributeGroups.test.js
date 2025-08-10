const assert = require('assert');
const {
  generateId,
  groupAttributesByGroupId
} = require('../lib/attributeGroups');

(function testGenerateIdUniqueness() {
  const set = new Set();
  for (let i = 0; i < 1000; i++) {
    const id = generateId();
    assert.strictEqual(typeof id, 'string');
    assert.ok(id.length >= 10);
    assert.ok(!set.has(id), 'id must be unique');
    set.add(id);
  }
})();

(function testGroupAttributesByGroupId() {
  const groups = [
    { id: 'g1', name: 'Specs' },
    { id: 'g2', name: 'Dimensions' }
  ];
  const attributes = [
    { id: 'a1', name: 'Color', attributeGroupId: 'g1' },
    { id: 'a2', name: 'Material', attributeGroupId: 'g1' },
    { id: 'a3', name: 'Width', attributeGroupId: 'g2' },
    { id: 'a4', name: 'Loose', attributeGroupId: 'g3' } // unknown group should still be grouped under its id
  ];
  const grouped = groupAttributesByGroupId(groups, attributes);
  assert.ok(grouped.g1 && grouped.g1.length === 2);
  assert.ok(grouped.g2 && grouped.g2.length === 1);
  assert.ok(grouped.g3 && grouped.g3.length === 1);
  // known groups should exist even if empty
  const grouped2 = groupAttributesByGroupId(groups, []);
  assert.ok(Array.isArray(grouped2.g1) && grouped2.g1.length === 0);
  assert.ok(Array.isArray(grouped2.g2) && grouped2.g2.length === 0);
})();

console.log('attributeGroups tests passed');
