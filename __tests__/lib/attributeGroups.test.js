const { loadAttributeGroups } = require('../../lib/attributeGroups');

describe('attributeGroups loader', () => {
  test('loads sample attribute groups and includes core group', () => {
    const groups = loadAttributeGroups();
    expect(Array.isArray(groups)).toBe(true);
    expect(groups.length).toBeGreaterThan(0);
    const ids = groups.map((g) => g.id);
    expect(ids).toContain('grp-core');
  });
});
