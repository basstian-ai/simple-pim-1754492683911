const assert = require('assert');
const { normalizeAttribute, validateGroup } = require('../lib/attributes-core');

// normalizeAttribute
{
  const a = normalizeAttribute({ code: ' Color Name ', label: 'Color', type: 'SELECT', options: 'Red, Green, Red\nBlue' });
  assert.strictEqual(a.code, 'color_name');
  assert.strictEqual(a.label, 'Color');
  assert.strictEqual(a.type, 'select');
  assert.deepStrictEqual(a.options.sort(), ['Blue', 'Green', 'Red'].sort());
}

// validateGroup - should catch errors
{
  const group = {
    name: '',
    attributes: [
      { code: '', type: 'text' },
      { code: 'size', type: 'select', options: [] },
      { code: 'size', type: 'number' },
    ],
  };
  const res = validateGroup(group);
  assert.strictEqual(res.valid, false);
  assert(res.errors.some((e) => e.includes('Group name is required')));
  assert(res.errors.some((e) => e.includes('code is required')));
  assert(res.errors.some((e) => e.includes("at least one option")));
  assert(res.errors.some((e) => e.includes('Duplicate attribute code')));
}

// validateGroup - valid
{
  const group = {
    name: 'Basics',
    attributes: [
      { code: 'title', type: 'text', required: true },
      { code: 'price', type: 'number' },
      { code: 'published', type: 'boolean' },
      { code: 'color', type: 'select', options: ['Red', 'Green'] },
    ],
  };
  const res = validateGroup(group);
  assert.strictEqual(res.valid, true);
  assert.deepStrictEqual(res.errors, []);
}

console.log('attributes.test.js passed');
