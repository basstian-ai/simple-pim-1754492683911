const test = require('node:test');
const assert = require('assert');
const store = require('../lib/productsStore');

// Basic smoke tests for the in-memory product store

test('list returns seeded items', () => {
  store.reset();
  const items = store.list();
  assert.ok(Array.isArray(items));
  assert.ok(items.length >= 1);
});

test('create -> update -> remove lifecycle', () => {
  store.reset();
  const created = store.create({ name: 'Test Item', sku: 'TST-001', price: 1234, attributes: [], variants: [] });
  assert.ok(created.id);
  const updated = store.update(created.id, { name: 'Updated Name' });
  assert.equal(updated.name, 'Updated Name');
  const removed = store.remove(created.id);
  assert.equal(removed, true);
});
