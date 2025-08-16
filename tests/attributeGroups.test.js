const request = require('supertest');
const app = require('../src/app');
const { __test__: internals } = require('../src/attributeGroupsService');

describe('Attribute Groups Search API', () => {
  test('returns default paginated results', async () => {
    const res = await request(app).get('/api/attribute-groups');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body.page).toBe(1);
    expect(res.body.perPage).toBe(10);
    // total should match in-memory dataset
    expect(res.body.total).toBe(internals.ATTRIBUTE_GROUPS.length);
  });

  test('filters by code exact match', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ code: 'color' });
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.results[0].code).toBe('color');
  });

  test('filters by required=true', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ required: 'true' });
    expect(res.statusCode).toBe(200);
    // From dataset, color and size are required
    expect(res.body.total).toBe(2);
    const codes = res.body.results.map(r => r.code).sort();
    expect(codes).toEqual(['color', 'size']);
  });

  test('supports substring q search on label and code', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ q: 'brand' });
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.results[0].code).toBe('brand');
  });

  test('paginates results', async () => {
    // set perPage small to force multiple pages
    const res1 = await request(app).get('/api/attribute-groups').query({ perPage: '3', page: '1' });
    const res2 = await request(app).get('/api/attribute-groups').query({ perPage: '3', page: '2' });
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res1.body.results.length).toBe(3);
    expect(res2.body.results.length).toBeGreaterThanOrEqual(1);
    // no overlap between page 1 and page 2
    const ids1 = res1.body.results.map(r => r.id);
    const ids2 = res2.body.results.map(r => r.id);
    ids1.forEach(id => expect(ids2).not.toContain(id));
  });

  test('returns 400 for invalid pagination params', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ page: '0' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');

    const res2 = await request(app).get('/api/attribute-groups').query({ perPage: '-5' });
    expect(res2.statusCode).toBe(400);
  });
});
