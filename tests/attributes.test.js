const assert = require('assert');
const { groupByGroupName } = require('../lib/attributes');

// Small unit test for attribute grouping utility
const sample = [
  { code: 'a', group: 'G1' },
  { code: 'b', group: 'G1' },
  { code: 'c', group: 'G2' },
  { code: 'd' }
];

const grouped = groupByGroupName(sample);

assert.strictEqual(Object.keys(grouped).length, 3, 'should create three groups including Ungrouped');
assert.strictEqual(grouped['G1'].length, 2, 'G1 should have two items');
assert.strictEqual(grouped['G2'].length, 1, 'G2 should have one item');
assert.strictEqual(grouped['Ungrouped'].length, 1, 'Ungrouped should have one item');

console.log('attributes.test.js OK');
