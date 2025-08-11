const handler = require('../pages/api/products/attributes-summary').default;
const products = require('../data/products.json');

describe('/api/products/attributes-summary', () => {
  test('returns totalProducts and attributeCounts object', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('totalProducts');
    expect(payload).toHaveProperty('attributeCounts');
    expect(typeof payload.totalProducts).toBe('number');
    expect(payload.totalProducts).toBe(products.length);
    expect(payload.attributeCounts && typeof payload.attributeCounts === 'object').toBe(true);
  });
});
