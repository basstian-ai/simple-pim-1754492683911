const assert = require('assert');
const {
  memoryStorage,
  loadGroups,
  saveGroups,
  createGroup,
  upsertGroup,
  deleteGroup,
  clearAll,
} = require('../lib/attributeGroups');

// Basic unit tests for attribute group helpers
(function run() {
  const store = { ...memoryStorage }; // shallow copy methods but independent storage not guaranteed; create a fresh one instead
  // create a fresh memory storage
  const createStore = () => {
    const map = new Map();
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => map.set(k, String(v)),
      removeItem: (k) => map.delete(k),
      clear: () => map.clear(),
    };
  };

  const s = createStore();
  clearAll(s);

  assert.deepStrictEqual(loadGroups(s), [], 'initial groups should be empty');

  const g1 = createGroup({ name: 'Dimensions', description: 'Physical measures', attributes: ['Width', 'Height', 'Depth'] });
  const afterInsert = upsertGroup(g1, s);
  assert.strictEqual(afterInsert.length, 1, 'one group after insert');
  assert.strictEqual(afterInsert[0].name, 'Dimensions');

  const g1Updated = { ...g1, description: 'Size related', attributes: ['Width', 'Height'] };
  const afterUpdate = upsertGroup(g1Updated, s);
  assert.strictEqual(afterUpdate[0].description, 'Size related', 'updated description persists');
  assert.deepStrictEqual(afterUpdate[0].attributes, ['Width', 'Height'], 'updated attributes persist');

  const afterDelete = deleteGroup(g1.id, s);
  assert.strictEqual(afterDelete.length, 0, 'group deleted');

  // Save and load roundtrip
  saveGroups([g1], s);
  const loaded = loadGroups(s);
  assert.strictEqual(loaded.length, 1, 'roundtrip load works');

  // If reached here without throwing, test passed
  console.log('attributeGroups tests passed');
})();
