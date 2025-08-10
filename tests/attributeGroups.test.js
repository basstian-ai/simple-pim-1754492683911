'use strict';

// Simple node test using built-in assert; run with `node tests/attributeGroups.test.js`
const assert = require('assert');
const { validateGroupPayload } = require('../lib/attributeGroups');

(function testValidPayload() {
  const payload = {
    name: 'Specifications',
    attributes: [
      { code: 'weight', label: 'Weight', type: 'number' },
      { code: 'is_active', label: 'Is Active', type: 'boolean' },
      { code: 'color', label: 'Color', type: 'select', options: ['Red', 'Green'] },
    ],
  };
  const res = validateGroupPayload(payload);
  assert.strictEqual(res.valid, true, 'Expected payload to be valid');
  assert.deepStrictEqual(res.errors, [], 'Expected no validation errors');
})();

(function testInvalidPayload() {
  const payload = {
    name: '', // invalid
    attributes: [
      { code: 'bad code', label: '', type: 'text' }, // invalid code and label
      { code: 'color', label: 'Color', type: 'select', options: [] }, // invalid options
      { code: 'color', label: 'Dup Code', type: 'text' }, // duplicate code
    ],
  };
  const res = validateGroupPayload(payload);
  assert.strictEqual(res.valid, false, 'Expected payload to be invalid');
  assert.ok(res.errors.length >= 3, 'Expected multiple validation errors');
})();

console.log('attributeGroups tests passed');
