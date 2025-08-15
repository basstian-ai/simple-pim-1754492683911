import { searchAttributeGroups } from '../src/services/attributeGroupsService';

describe('attributeGroupsService.searchAttributeGroups', () => {
  test('returns paginated results with defaults', () => {
    const res = searchAttributeGroups({}, 1, 5);
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(5);
    expect(res.items.length).toBe(5);
    expect(res.total).toBeGreaterThanOrEqual(5);
    expect(res.totalPages).toBeGreaterThanOrEqual(1);
  });

  test('filters by code (substring, case-insensitive)', () => {
    const res = searchAttributeGroups({ code: 'Color' }, 1, 10);
    expect(res.total).toBeGreaterThanOrEqual(1);
    expect(res.items.every(i => /color/i.test(i.code))).toBeTruthy();
  });

  test('filters by label (substring, case-insensitive)', () => {
    const res = searchAttributeGroups({ label: 'country' }, 1, 10);
    expect(res.total).toBe(1);
    expect(res.items[0].code).toBe('origin');
  });

  test('filters by type (exact match)', () => {
    const res = searchAttributeGroups({ type: 'number' }, 1, 20);
    expect(res.items.every(i => i.type === 'number')).toBeTruthy();
    expect(res.total).toBeGreaterThanOrEqual(1);
  });

  test('filters by required boolean', () => {
    const resRequired = searchAttributeGroups({ required: true }, 1, 50);
    expect(resRequired.items.every(i => i.required === true)).toBeTruthy();
    const resNotRequired = searchAttributeGroups({ required: false }, 1, 50);
    expect(resNotRequired.items.every(i => i.required === false)).toBeTruthy();
    expect(resRequired.total + resNotRequired.total).toBeGreaterThanOrEqual(resRequired.total);
  });

  test('pagination boundaries: page beyond total returns last page', () => {
    const pageSize = 3;
    const first = searchAttributeGroups({}, 1, pageSize);
    const lastPage = first.totalPages + 5; // beyond end
    const res = searchAttributeGroups({}, lastPage, pageSize);
    expect(res.page).toBe(first.totalPages);
    // items may be less than pageSize on last page
    expect(res.items.length).toBeLessThanOrEqual(pageSize);
  });

  test('invalid page/pageSize throws', () => {
    expect(() => searchAttributeGroups({}, 0, 10)).toThrow();
    expect(() => searchAttributeGroups({}, 1, 0)).toThrow();
    expect(() => searchAttributeGroups({}, 1, 1000)).toThrow();
  });
});
