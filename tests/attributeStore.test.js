const assert = require('assert');
const store = require('../lib/attributeStore');
const { attributeGroups } = require('../lib/sampleData');

// Reset to known state
store.reset(attributeGroups);

const beforeCount = store.getAttributeGroups().length;
const g = store.addGroup('Test Group');
assert.ok(g && g.id && g.name === 'Test Group', 'Group should be created with id and name');
const afterCount = store.getAttributeGroups().length;
assert.strictEqual(afterCount, beforeCount + 1, 'Group count should increase by 1');

const attr = store.addAttribute(g.id, { name: 'Test Attribute', type: 'text' });
assert.ok(attr && attr.id && attr.code === 'test_attribute', 'Attribute should be created with slug code');

const found = store.getAttributeGroups().find((x) => x.id === g.id);
assert.strictEqual(found.attributes.length, 1, 'New group should have 1 attribute');

console.log('attributeStore tests passed');
