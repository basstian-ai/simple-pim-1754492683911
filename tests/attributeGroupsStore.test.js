'use strict';

const assert = require('assert');
const store = require('../lib/store/attributeGroups');

// Simple smoke test for Attribute Groups store
(function run() {
  // Ensure starting from a clean-ish state
  const before = store.listGroups();

  // Create
  const g1 = store.createGroup({ name: 'General', description: 'Default attributes' });
  assert.ok(g1.id, 'created group should have id');
  assert.strictEqual(g1.name, 'General');

  // List
  const list1 = store.listGroups();
  assert.ok(Array.isArray(list1));
  assert.ok(list1.length >= 1);

  // Get
  const g1f = store.getGroup(g1.id);
  assert.strictEqual(g1f.id, g1.id);

  // Update
  const g1u = store.updateGroup(g1.id, { name: 'Basics' });
  assert.strictEqual(g1u.name, 'Basics');

  // Delete
  const removed = store.deleteGroup(g1.id);
  assert.strictEqual(removed.id, g1.id);

  const after = store.listGroups();
  assert.strictEqual(after.length, Math.max(0, before.length));

  // Edge cases
  let threw = false;
  try {
    store.createGroup({ name: '   ' });
  } catch (e) {
    threw = true;
  }
  assert.ok(threw, 'should validate name');
})();

console.log('attributeGroupsStore.test.js: OK');
