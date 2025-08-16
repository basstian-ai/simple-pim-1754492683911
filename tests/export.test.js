const request = require('supertest');
const app = require('../src/app');
const { setProducts } = require('../src/services/productService');

describe('Filtered CSV Export for Products', () => {
  beforeEach(() => {
    setProducts([
      { id: 'p1', name: 'Red Shirt', price: 10.5, stock: 5, tags: ['clothing', 'red'] },
      { id: 'p2', name: 'Blue Jeans', price: 25, stock: 0, tags: ['clothing', 'blue'] },
      { id: 'p3', name: 'Green Hat', price: 8, stock: 3, tags: ['accessories', 'green'] },
      { id: 'p4', name: 'Red Socks', price: 4, stock: 10, tags: ['clothing', 'red'] },
    ]);
  });

  test('exports all products when no filters provided', async () => {
    const res = await request(app).get('/admin/products/export');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    const lines = res.text.trim().split('\n');
    // header + 4 products
    expect(lines.length).toBe(1 + 4);
    expect(res.text).toMatch(/Red Shirt/);
    expect(res.text).toMatch(/Blue Jeans/);
  });

  test('respects search filter (name & tags)', async () => {
    const res = await request(app).get('/admin/products/export').query({ search: 'red' });
    expect(res.status).toBe(200);
    const lines = res.text.trim().split('\n');
    // header + 2 products (Red Shirt, Red Socks)
    expect(lines.length).toBe(1 + 2);
    expect(res.text).toMatch(/Red Socks/);
    expect(res.text).not.toMatch(/Blue Jeans/);
  });

  test('respects tags filter (comma-separated)', async () => {
    const res = await request(app).get('/admin/products/export').query({ tags: 'accessories' });
    expect(res.status).toBe(200);
    const lines = res.text.trim().split('\n');
    expect(lines.length).toBe(1 + 1);
    expect(res.text).toMatch(/Green Hat/);
  });

  test('respects inStock=true filter (exclude stock 0)', async () => {
    const res = await request(app).get('/admin/products/export').query({ inStock: 'true' });
    expect(res.status).toBe(200);
    const lines = res.text.trim().split('\n');
    // header + 3 products (exclude Blue Jeans)
    expect(lines.length).toBe(1 + 3);
    expect(res.text).not.toMatch(/Blue Jeans/);
  });

  test('respects pagination (page & perPage)', async () => {
    // perPage=2, page=2 -> items 3 and 4
    const res = await request(app).get('/admin/products/export').query({ perPage: '2', page: '2' });
    expect(res.status).toBe(200);
    const lines = res.text.trim().split('\n');
    expect(lines.length).toBe(1 + 2);
    expect(res.text).toMatch(/Green Hat/);
    expect(res.text).toMatch(/Red Socks/);
  });
});
