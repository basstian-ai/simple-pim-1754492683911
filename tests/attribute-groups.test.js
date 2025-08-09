const assert = require('assert');
const { getAttributeGroups } = require('../lib/attributeGroups');

const groups = getAttributeGroups();

assert(Array.isArray(groups), 'groups should be an array');
assert(groups.length >= 1, 'should have at least one group');

for (const g of groups) {
  assert(typeof g.id === 'string' && g.id, 'group.id should be a non-empty string');
  assert(typeof g.name === 'string' && g.name, 'group.name should be a non-empty string');
  assert(Array.isArray(g.attributes), 'group.attributes should be an array');
  for (const a of g.attributes) {
    assert(typeof a.code === 'string' && a.code, 'attribute.code should be a non-empty string');
    assert(typeof a.label === 'string' && a.label, 'attribute.label should be a non-empty string');
    assert(typeof a.type === 'string' && a.type, 'attribute.type should be a non-empty string');
  }
}

console.log('OK: attribute groups structure looks valid');
