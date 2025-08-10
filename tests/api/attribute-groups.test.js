const store = require('../../lib/attributeGroupsStore');

beforeEach(() => {
  if (typeof store._resetForTests === 'function') store._resetForTests();
});

test('lists seeded attribute groups', () => {
  const items = store.list();
  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBeGreaterThanOrEqual(2);
  // Ensure basic structure
  expect(items[0]).toHaveProperty('id');
  expect(items[0]).toHaveProperty('name');
  expect(items[0]).toHaveProperty('attributes');
});

test('creates a new attribute group', () => {
  const before = store.list().length;
  const created = store.create({
    name: 'Materials',
    position: 3,
    attributes: [
      { code: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Wool'] },
    ],
  });
  expect(created).toHaveProperty('id');
  expect(created.name).toBe('Materials');
  const after = store.list().length;
  expect(after).toBe(before + 1);
});
