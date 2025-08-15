import express from 'express';
import request from 'supertest';

import attributeGroupsRouter from '../src/server/routes/attributeGroups';
import * as service from '../src/server/services/attributeGroupService';

describe('Attribute Groups search API', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use('/api/attribute-groups', attributeGroupsRouter);
  });

  test('returns paginated results and total', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ page: 1, perPage: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body.page).toBe(1);
    expect(res.body.perPage).toBe(2);
  });

  test('filters by code substring (case-insensitive)', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ code: 'Color' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    const codes = res.body.items.map((i: any) => i.code);
    expect(codes.some((c: string) => c.toLowerCase().includes('color'.toLowerCase()))).toBe(true);
  });

  test('filters by label substring (case-insensitive)', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ label: 'weight' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].code).toBe('weight');
  });

  test('filters by type exact match', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ type: 'boolean' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].type).toBe('boolean');
  });

  test('filters by required boolean', async () => {
    const resTrue = await request(app).get('/api/attribute-groups').query({ required: 'true' });
    expect(resTrue.status).toBe(200);
    expect(resTrue.body.total).toBeGreaterThanOrEqual(1);
    resTrue.body.items.forEach((it: any) => expect(it.required).toBe(true));

    const resFalse = await request(app).get('/api/attribute-groups').query({ required: 'false' });
    expect(resFalse.status).toBe(200);
    resFalse.body.items.forEach((it: any) => expect(it.required).toBe(false));
  });

  test('returns 400 for invalid page (less than 1)', async () => {
    const res = await request(app).get('/api/attribute-groups').query({ page: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('handles internal errors gracefully (500)', async () => {
    const spy = jest.spyOn(service, 'searchAttributeGroups').mockRejectedValueOnce(new Error('boom'));
    const res = await request(app).get('/api/attribute-groups');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    spy.mockRestore();
  });
});
