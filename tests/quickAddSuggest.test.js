import handler from '../pages/api/quick-add-suggest';
import slugify from '../lib/slugify';

describe('API /api/quick-add-suggest', () => {
  function createMockRes() {
    const res = {};
    res.statusCode = 200;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.body = data;
      return res;
    };
    return res;
  }

  test('returns slug and sku for provided name', async () => {
    const req = { method: 'GET', query: { name: 'Red Mug 12oz' } };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Red Mug 12oz');
    expect(res.body).toHaveProperty('slug', slugify('Red Mug 12oz'));
    expect(res.body).toHaveProperty('sku');
    expect(res.body.sku).toMatch(/^[A-Z0-9-]{5,}$/);
  });

  test('returns 400 when name is missing', async () => {
    const req = { method: 'GET', query: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
