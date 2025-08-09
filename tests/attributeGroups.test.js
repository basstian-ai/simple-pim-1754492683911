const assert = require('assert');
const { resetStore, createGroup, listGroups, updateGroup } = require('../lib/attributeGroups');

function testCreateAndList() {
  resetStore();
  let g1 = createGroup({ name: 'Specifications', attributes: [{ code: 'color', label: 'Color' }] });
  let g2 = createGroup({ name: 'Dimensions', attributes: [{ code: 'height', label: 'Height' }] });
  const all = listGroups();
  assert.strictEqual(all.length, 2, 'Should list two groups');
  assert.strictEqual(all[0].id, '1', 'First id is 1');
  assert.strictEqual(all[1].id, '2', 'Second id is 2');
  assert.strictEqual(g1.name, 'Specifications');
  assert.strictEqual(g2.attributes[0].code, 'height');
}

function testUniqueName() {
  resetStore();
  createGroup({ name: 'Specs', attributes: [] });
  let threw = false;
  try {
    createGroup({ name: 'Specs', attributes: [] });
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Should throw on duplicate name');
}

function testUpdateNameUniqueness() {
  resetStore();
  createGroup({ name: 'A', attributes: [] });
  const b = createGroup({ name: 'B', attributes: [] });
  let threw = false;
  try {
    updateGroup(b.id, { name: 'A' });
  } catch (e) {
    threw = true;
  }
  assert.strictEqual(threw, true, 'Should not allow renaming to existing name');
}

function run() {
  testCreateAndList();
  testUniqueName();
  testUpdateNameUniqueness();
  console.log('attributeGroups tests passed');
}

if (require.main === module) {
  run();
}

module.exports = { run };
