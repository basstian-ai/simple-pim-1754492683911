const test = require('node:test');
const assert = require('assert');
const store = require('../lib/attributeGroupsStore');

test('attributeGroupsStore: add and list groups', () => {
  store._reset();
  assert.strictEqual(store.listGroups().length, 0);
  const g = store.addGroup({ name: 'Specs', description: 'Tech specs' });
  assert.ok(g.id && typeof g.id === 'string');
  assert.strictEqual(g.name, 'Specs');
  const items = store.listGroups();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].id, g.id);
});

test('attributeGroupsStore: generates unique ids', () => {
  store._reset();
  const g1 = store.addGroup({ name: 'Core' });
  const g2 = store.addGroup({ name: 'Core' });
  assert.notStrictEqual(g1.id, g2.id);
});

test('attributeGroupsStore: validation', () => {
  store._reset();
  let threw = false;
  try {
    store.addGroup({ name: '' });
  } catch (e) {
    threw = true;
    assert.strictEqual(e.code, 'VALIDATION_ERROR');
  }
  assert.ok(threw);
});
