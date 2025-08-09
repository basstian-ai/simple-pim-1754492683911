const assert = require('assert');

const groups = require('../data/attribute-groups.json');

// basic shape tests
assert(Array.isArray(groups), 'groups should be an array');
assert(groups.length >= 1, 'should have at least one group');

for (const g of groups) {
  assert(typeof g.id === 'string' && g.id.length > 0, 'group.id must be a non-empty string');
  assert(typeof g.name === 'string' && g.name.length > 0, 'group.name must be a non-empty string');
  assert(Array.isArray(g.attributes), 'group.attributes must be an array');
  for (const a of g.attributes) {
    assert(typeof a.code === 'string' && a.code.length > 0, 'attribute.code must be a non-empty string');
    assert(typeof a.label === 'string' && a.label.length > 0, 'attribute.label must be a non-empty string');
    assert(['text', 'richtext', 'number', 'select'].includes(a.type), 'attribute.type must be one of known types');
    if (a.type === 'select') {
      assert(Array.isArray(a.options) && a.options.length > 0, 'select attribute must define non-empty options');
    }
  }
}

console.log('attribute-groups tests passed (', groups.length, 'groups )');
