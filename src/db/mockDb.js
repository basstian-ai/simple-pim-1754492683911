// Minimal mock DB used by the dashboard route/service.
// In a real application this would be replaced with actual DB queries with pagination and indexes.

const products = [
  { id: 'p1', title: 'Blue T-Shirt', inStock: true, tags: ['clothing', 'shirt', 'blue'] },
  { id: 'p2', title: 'Red T-Shirt', inStock: false, tags: ['clothing', 'shirt', 'red'] },
  { id: 'p3', title: 'Sneakers', inStock: true, tags: ['shoes', 'sport'] },
  { id: 'p4', title: 'Socks', inStock: true, tags: ['clothing', 'socks'] }
];

const activities = [
  { id: 'a1', type: 'update', detail: 'Price update', ts: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'a2', type: 'create', detail: 'New product created', ts: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'a3', type: 'publish', detail: 'Product published to channel', ts: new Date().toISOString() }
];

module.exports = {
  async listProducts() {
    // Simulate async DB access
    return Promise.resolve(products.slice());
  },

  async listRecentActivity({ limit = 20 } = {}) {
    return Promise.resolve(activities.slice(0, limit));
  }
};
