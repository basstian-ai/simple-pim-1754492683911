const { getDashboardMetrics, clearCache } = require('../src/services/dashboardService');

describe('dashboardService.getDashboardMetrics', () => {
  afterEach(() => {
    clearCache();
  });

  it('computes totals and tag counts', async () => {
    const mockDb = {
      listProducts: async () => [
        { id: 'p1', inStock: true, tags: ['a', 'b'] },
        { id: 'p2', inStock: false, tags: ['b'] },
        { id: 'p3', inStock: true, tags: [] }
      ],
      listRecentActivity: async () => [
        { id: 'x', type: 'update', ts: new Date().toISOString() }
      ]
    };

    const res = await getDashboardMetrics(mockDb, { ttlMs: 1000 });
    expect(res.totalProducts).toBe(3);
    expect(res.inStockCount).toBe(2);
    expect(Array.isArray(res.topTags)).toBe(true);

    const tagMap = Object.fromEntries(res.topTags.map(t => [t.tag, t.count]));
    expect(tagMap['b']).toBe(2);
    expect(tagMap['a']).toBe(1);
    expect(res.cached).toBe(false);
  });

  it('returns cached result within TTL', async () => {
    let calls = 0;
    const mockDb = {
      listProducts: async () => {
        calls += 1;
        return [ { id: 'p1', inStock: true, tags: ['x'] } ];
      },
      listRecentActivity: async () => []
    };

    const first = await getDashboardMetrics(mockDb, { ttlMs: 5000 });
    const second = await getDashboardMetrics(mockDb, { ttlMs: 5000 });

    expect(calls).toBe(1); // only one real DB invocation
    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(second.totalProducts).toBe(1);
  });
});
