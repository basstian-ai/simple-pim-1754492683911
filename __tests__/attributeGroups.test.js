const { normalizeGroup, validateGroup, parseAttributesString } = require('../lib/attributeGroups');

describe('attributeGroups helpers', () => {
  test('parseAttributesString supports commas and newlines and dedupes', () => {
    const input = 'Width, Height\nDepth\nWidth';
    const out = parseAttributesString(input);
    expect(out).toEqual(['Width', 'Height', 'Depth']);
  });

  test('normalizeGroup fills id and cleans attributes', () => {
    const g = normalizeGroup({ name: 'Dimensions', attributes: 'Width, Height\nDepth' });
    expect(g.name).toBe('Dimensions');
    expect(Array.isArray(g.attributes)).toBe(true);
    expect(g.attributes).toEqual(['Width', 'Height', 'Depth']);
    expect(typeof g.id).toBe('string');
    expect(g.id.length).toBeGreaterThan(3);
  });

  test('validateGroup catches empty values', () => {
    let { valid, errors } = validateGroup({ name: '', attributes: [] });
    expect(valid).toBe(false);
    expect(errors.join(' ')).toMatch(/Name is required/);
    ({ valid, errors } = validateGroup({ name: 'A', attributes: [] }));
    expect(valid).toBe(false);
    expect(errors.join(' ')).toMatch(/at least 2/);
    ({ valid, errors } = validateGroup({ name: 'Valid', attributes: ['A'] }));
    expect(valid).toBe(true);
  });
});
