const path = require('path');

function createMockRes() {
  let statusCode = 200;
  const headers = {};
  let body = null;
  const res = {
    setHeader: (k, v) => {
      headers[k] = v;
    },
    status: (code) => {
      statusCode = code;
      return res;
    },
    send: (b) => {
      body = b;
      return res;
    },
    end: (b) => {
      body = b;
      return res;
    },
    json: (obj) => {
      body = JSON.stringify(obj);
      return res;
    },
    _getData: () => ({ statusCode, headers, body }),
  };
  return res;
}

describe('API: GET /api/tags/export', () => {
  test('returns CSV with tag header and includes all tags from products', async () => {
    const handler = require(path.join('..', 'pages', 'api', 'tags', 'export.js')).default;

    const products = require('../data/products.json');
    const expectedTags = Array.from(
      new Set(
        [].concat(
          ...products.map((p) =>
            Array.isArray(p?.tags)
              ? p.tags
                  .filter((t) => typeof t === 'string')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : []
          )
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    const req = { method: 'GET', query: {} };
    const res = createMockRes();

    await handler(req, res);
    const { statusCode, headers, body } = res._getData();

    expect(statusCode).toBe(200);
    expect(headers['Content-Type'] || headers['content-type']).toMatch(/text\/csv/);
    expect(typeof body).toBe('string');
    expect(body.startsWith('tag\n')).toBe(true);

    // Ensure each expected tag appears somewhere in the CSV output
    expectedTags.forEach((tag) => {
      expect(body).toContain(tag);
    });

    // Lines should be header + number of tags (or just header if none)
    const lines = body.split('\n').filter((l) => l.length > 0);
    expect(lines.length).toBe(1 + expectedTags.length);
  });
});
