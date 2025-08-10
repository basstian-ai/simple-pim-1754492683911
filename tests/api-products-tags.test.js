const handler = require('../pages/api/products').default;

function createRes() {
  let statusCode = 0;
  let body = undefined;
  return {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          body = data;
        },
      };
    },
    getStatus() {
      return statusCode;
    },
    getBody() {
      return body;
    },
  };
}

describe('GET /api/products with tags filter', () => {
  test('returns only products that include the requested tag', async () => {
    const allProducts = require('../data/products.json');
    const allTags = Array.from(
      new Set(
        [].concat(
          ...allProducts.map((p) => Array.isArray(p.tags) ? p.tags : [])
        )
      )
    );

    // If dataset has no tags, skip test gracefully
    if (allTags.length === 0) {
      console.warn('No tags found in dataset; skipping tag filter test.');
      return;
    }

    const tag = allTags[0];

    const req = { query: { tags: encodeURIComponent(tag) } };
    const res = createRes();

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    const data = res.getBody();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    // Every product should include the tag
    for (const p of data) {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      expect(tags.includes(tag)).toBe(true);
    }
  });
});
