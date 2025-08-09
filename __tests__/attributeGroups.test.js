import { addGroupPure, updateGroupPure, deleteGroupPure, moveGroupPure, slugify } from '../lib/attributeGroups';

describe('attributeGroups utils', () => {
  test('slugify produces URL-safe codes', () => {
    expect(slugify('Color Name')).toBe('color-name');
    expect(slugify('  Size/Weight ')).toBe('size-weight');
    expect(slugify('ÄÖÜ - ñ')).toBe('aou-n');
  });

  test('addGroupPure adds a group with generated code', () => {
    const groups = [];
    const next = addGroupPure(groups, { name: 'Basic Info' });
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe('Basic Info');
    expect(next[0].code).toBe('basic-info');
    expect(next[0].id).toBeTruthy();
  });

  test('updateGroupPure updates fields and slugifies code', () => {
    const initial = addGroupPure([], { name: 'Details', code: 'custom code' });
    const id = initial[0].id;
    const updated = updateGroupPure(initial, id, { name: 'More Details', code: 'New Code' });
    expect(updated[0].name).toBe('More Details');
    expect(updated[0].code).toBe('new-code');
  });

  test('deleteGroupPure removes by id', () => {
    const a = addGroupPure([], { name: 'A' });
    const b = addGroupPure(a, { name: 'B' });
    const idToRemove = a[0].id;
    const next = deleteGroupPure(b, idToRemove);
    expect(next).toHaveLength(1);
    expect(next[0].name).toBe('B');
  });

  test('moveGroupPure reorders items safely', () => {
    const a = addGroupPure([], { name: 'A' });
    const b = addGroupPure(a, { name: 'B' });
    const c = addGroupPure(b, { name: 'C' });
    const moved = moveGroupPure(c, 0, 2);
    expect(moved.map((g) => g.name)).toEqual(['B', 'C', 'A']);
    const noChange = moveGroupPure(moved, -1, 5);
    expect(noChange.map((g) => g.name)).toEqual(['B', 'C', 'A']);
  });
});
