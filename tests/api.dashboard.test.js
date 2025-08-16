const request = require('supertest');
const app = require('../src/index');
const { clearCache } = require('../src/services/dashboardService');

describe('GET /api/admin/dashboard', () => {
  afterEach(() => clearCache());

  it('returns 200 and metrics shape', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('metrics');
    const m = res.body.metrics;
    expect(typeof m.totalProducts).toBe('number');
    expect(typeof m.inStockCount).toBe('number');
    expect(Array.isArray(m.topTags)).toBe(true);
    expect(Array.isArray(m.recentActivity)).toBe(true);
  });

  it('handles invalid ttl query param gracefully', async () => {
    const res = await request(app).get('/api/admin/dashboard?ttlMs=notanumber');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
