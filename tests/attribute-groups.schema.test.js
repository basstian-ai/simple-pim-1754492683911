/*
  Minimal schema test for attribute groups data.
  Run with: node tests/attribute-groups.schema.test.js
*/
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
const raw = fs.readFileSync(filePath, 'utf8');
const groups = JSON.parse(raw);

try {
  assert(Array.isArray(groups), 'groups should be an array');
  for (const g of groups) {
    assert.strictEqual(typeof g.id, 'string', 'group.id must be string');
    assert.ok(g.id.length > 0, 'group.id must not be empty');
    assert.strictEqual(typeof g.name, 'string', 'group.name must be string');
    assert.ok(Array.isArray(g.attributes), 'group.attributes must be array');
    for (const a of g.attributes) {
      assert.strictEqual(typeof a.code, 'string', 'attribute.code must be string');
      assert.strictEqual(typeof a.label, 'string', 'attribute.label must be string');
      assert.strictEqual(typeof a.type, 'string', 'attribute.type must be string');
      if (a.options !== undefined) {
        assert.ok(Array.isArray(a.options), 'attribute.options must be array when provided');
      }
    }
  }
  console.log('OK: attribute-groups schema is valid');
  process.exit(0);
} catch (err) {
  console.error('FAIL:', err.message);
  process.exit(1);
}
