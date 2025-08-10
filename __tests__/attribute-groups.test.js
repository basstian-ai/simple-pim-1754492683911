const fs = require('fs');
const path = require('path');

describe('attribute-groups JSON', () => {
  test('has groups with expected shape', () => {
    const filePath = path.join(process.cwd(), 'data', 'attribute-groups.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    expect(data).toHaveProperty('groups');
    expect(Array.isArray(data.groups)).toBe(true);
    expect(data.groups.length).toBeGreaterThan(0);

    for (const g of data.groups) {
      expect(typeof g.id).toBe('string');
      expect(typeof g.name).toBe('string');
      expect(Array.isArray(g.attributes)).toBe(true);
      for (const a of g.attributes) {
        expect(typeof a.code).toBe('string');
        expect(typeof a.label).toBe('string');
        expect(typeof a.type).toBe('string');
      }
    }
  });
});
