const paginate = require('../lib/pagination');

describe('paginate()', () => {
  const items = Array.from({ length: 55 }, (_, i) => ({ id: i + 1 }));

  test('returns correct page items and metadata for first page', () => {
    const { pageItems, total, page, pageSize, totalPages } = paginate(items, 1, 20);
    expect(total).toBe(55);
    expect(page).toBe(1);
    expect(pageSize).toBe(20);
    expect(totalPages).toBe(3);
    expect(pageItems.length).toBe(20);
    expect(pageItems[0].id).toBe(1);
    expect(pageItems[pageItems.length - 1].id).toBe(20);
  });

  test('returns last page with remainder items', () => {
    const { pageItems, page, totalPages } = paginate(items, 3, 20);
    expect(page).toBe(3);
    expect(totalPages).toBe(3);
    expect(pageItems.length).toBe(15);
    expect(pageItems[0].id).toBe(41);
    expect(pageItems[pageItems.length - 1].id).toBe(55);
  });

  test('handles page out of range by clamping', () => {
    const outLow = paginate(items, -5, 10);
    expect(outLow.page).toBe(1);
    const outHigh = paginate(items, 999, 10);
    expect(outHigh.page).toBe(outHigh.totalPages);
  });

  test('handles non-array gracefully', () => {
    const result = paginate(null, 1, 10);
    expect(result.total).toBe(0);
    expect(result.pageItems).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});
