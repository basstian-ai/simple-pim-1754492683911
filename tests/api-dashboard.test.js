const apiModule = require('../pages/api/dashboard');
const handler = apiModule.default || apiModule;

async function resolveProducts() {
  let productsModule = require('../lib/products');
  productsModule = productsModule && productsModule.default ? productsModule.default : productsModule;
  if (productsModule && typeof productsModule.getProducts === 'function') {
    const res = productsModule.getProducts();
    return res && typeof res.then === 'function' ? await res : res;
  }
  if (Array.isArray(productsModule)) return productsModule;
  if (productsModule && Array.isArray(productsModule.products)) return productsModule.products;
  return [];
}

function createMockRes() {
  let statusCode = 200;
  let jsonData = undefined;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonData = data;
      return this;
    },
    _getStatus() {
      return statusCode;
    },
    _getJSON() {
      return jsonData;
    },
  };
}

describe('API /api/dashboard', () => {
  test('returns dashboard stats with expected shape', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

    expect(res._getStatus()).toBe(200);
    const data = res._getJSON();
    expect(data).toBeTruthy();
    expect(typeof data.totalProducts).toBe('number');
    expect(typeof data.inStock).toBe('number');
    expect(typeof data.outOfStock).toBe('number');
    expect(Array.isArray(data.topTags)).toBe(true);
  });

  test('totalProducts matches product catalog size', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

    const data = res._getJSON();
    const products = await resolveProducts();
    expect(data.totalProducts).toBe(products.length);
    expect(data.inStock + data.outOfStock).toBe(products.length);
  });
});
