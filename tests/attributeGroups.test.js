const assert = require('assert');
const { listGroups, createGroup, updateGroup, deleteGroup, STORAGE_KEY } = require('../lib/attributeGroups');

function makeStorage() {
  const mem = {};
  return {
    getItem: (k) => (k in mem ? mem[k] : null),
    setItem: (k, v) => {
      mem[k] = String(v);
    },
    removeItem: (k) => {
      delete mem[k];
    },
    _dump: () => mem,
  };
}

(function run() {
  const storage = makeStorage();

  // Initially empty
  assert.deepStrictEqual(listGroups(storage), [], 'should start empty');

  // Create
  const g1 = createGroup({ name: 'Dimensions', description: 'Size related attributes' }, storage);
  assert.ok(g1.id && g1.name === 'Dimensions');

  const g2 = createGroup({ name: 'Materials' }, storage);
  assert.ok(g2.id && g2.name === 'Materials');

  // List sorted by name
  const listed = listGroups(storage);
  assert.strictEqual(listed.length, 2);
  assert.strictEqual(listed[0].name < listed[1].name, true);

  // Update
  const updated = updateGroup(g1.id, { name: 'Physical Dimensions', description: 'updated' }, storage);
  assert.strictEqual(updated.name, 'Physical Dimensions');
  assert.strictEqual(updated.description, 'updated');

  // Delete
  const delOk = deleteGroup(g2.id, storage);
  assert.strictEqual(delOk, true);
  assert.strictEqual(listGroups(storage).length, 1);

  // Storage key exists
  assert.ok(Object.prototype.hasOwnProperty.call(storage._dump(), STORAGE_KEY));

  console.log('attributeGroups.test.js: OK');
})();
