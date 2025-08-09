const assert = require('assert');
const { slugify, createGroup, validateGroup, createAttribute } = require('../lib/attributes');

// Simple smoke tests for core utilities
(function testSlugify() {
  assert.strictEqual(slugify('Color Shade'), 'color-shade');
  assert.strictEqual(slugify('  Fancy  SKU 123  '), 'fancy-sku-123');
  assert.strictEqual(slugify('ÄÖÜß'), 'aouss');
})();

(function testCreateAndValidateGroup() {
  const g = createGroup('SEO');
  assert.ok(validateGroup(g), 'Newly created group should be valid');
  assert.ok(typeof g.id === 'string' && g.id.length > 0);
  assert.strictEqual(g.name, 'SEO');
  assert.ok(Array.isArray(g.attributes));
})();

(function testAttributeBasics() {
  const a = createAttribute('Title', 'text');
  assert.ok(a.id && a.code && a.name);
  assert.strictEqual(a.type, 'text');
})();

console.log('attributes.test.js passed');
