const assert = require('assert');
const { normalizeAttributes, validateAttributeGroup, upsertGroup } = require('../lib/attributeGroups');

(function testNormalizeAttributes() {
  const input = 'Width, Height; Depth\nHEIGHT; ';
  const out = normalizeAttributes(input);
  assert(Array.isArray(out), 'normalizeAttributes returns array');
  const names = out.map((a) => a.name);
  assert.deepStrictEqual(names.sort(), ['Depth', 'Height', 'Width'].sort(), 'dedup and trim works');
})();

(function testValidateDuplicateName() {
  const existing = [
    { id: '1', name: 'Dimensions', attributes: [{ name: 'Width' }] },
    { id: '2', name: 'Materials', attributes: [{ name: 'Material' }] },
  ];
  const group = { id: '3', name: 'dimensions', attributes: [{ name: 'Height' }] };
  const errs = validateAttributeGroup(group, existing);
  assert(errs.some((e) => /already exists/i.test(e)), 'detects duplicate group name case-insensitively');
})();

(function testUpsertById() {
  const g1 = { id: '1', name: 'A', attributes: [{ name: 'x' }], createdAt: '2022-01-01' };
  const g2 = { id: '2', name: 'B', attributes: [{ name: 'y' }], createdAt: '2022-01-02' };
  const list = [g1, g2];
  const updated = upsertGroup(list, { id: '2', name: 'B2', attributes: [{ name: 'y' }] });
  assert.strictEqual(updated.length, 2, 'no change in length on update');
  assert.strictEqual(updated[1].name, 'B2', 'updated at correct index');
})();

console.log('attributeGroups.local.test.js passed');
