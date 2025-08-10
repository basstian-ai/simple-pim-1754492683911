const assert = require('assert');
const groups = require('../data/attribute-groups.json');

assert.ok(Array.isArray(groups), 'groups should be an array');
assert.ok(groups.length > 0, 'groups should not be empty');

for (const g of groups) {
  assert.ok(g.name, 'group should have a name');
  assert.ok(Array.isArray(g.attributes), 'group should have attributes array');
  for (const a of g.attributes) {
    assert.ok(a.code, 'attribute should have a code');
  }
}

console.log('OK: attribute groups data shape is valid');
