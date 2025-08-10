const assert = require('assert');
const store = require('../lib/data/attributesStore');

// Minimal smoke tests for the in-memory attribute store
(function run() {
  const before = store.getSnapshot();
  const g = store.addGroup('Test Group');
  assert.ok(g.id && g.name === 'Test Group');

  const attr = store.addAttribute(g.id, { name: 'Rating', type: 'number' });
  assert.ok(attr.id && attr.type === 'number');

  const updated = store.updateAttribute(g.id, attr.id, { unit: 'stars' });
  assert.strictEqual(updated.unit, 'stars');

  const renamed = store.renameGroup(g.id, 'Renamed Group');
  assert.strictEqual(renamed.name, 'Renamed Group');

  const delAttr = store.deleteAttribute(g.id, attr.id);
  assert.strictEqual(delAttr.id, attr.id);

  const delGroup = store.deleteGroup(g.id);
  assert.strictEqual(delGroup.id, g.id);

  const after = store.getSnapshot();
  assert.ok(Array.isArray(after.groups));

  // Ensure initial groups are still present
  assert.ok(before.groups[0] && after.groups[0]);
})();
