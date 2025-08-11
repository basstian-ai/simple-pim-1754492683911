const exportHandler = require('../pages/api/products/export.js');

// Helper to mock Next.js API req/res
+function createMockReqRes(query = {}) {
+  const req = { method: 'GET', query };
+  const res = {
+    _status: 200,
+    _headers: {},
+    _data: '',
+    status(code) {
+      this._status = code;
+      return this;
+    },
+    setHeader(k, v) {
+      this._headers[k] = v;
+    },
+    send(d) {
+      this._data = d;
+    },
+    json(obj) {
+      this._data = JSON.stringify(obj);
+    },
+  };
+  return { req, res };
+}
+
+describe('API /api/products/export with fields parameter', () => {
+  test('returns only requested valid fields in header and rows', async () => {
+    const { req, res } = createMockReqRes({ fields: 'sku,name', inStock: '1' });
+    await exportHandler.default(req, res);
+    expect(res._status).toBe(200);
+    const text = String(res._data);
+    const lines = text.trim().split(/\r?\n/);
+    expect(lines[0]).toBe('sku,name');
+    // At least one row
+    expect(lines.length).toBeGreaterThan(1);
+    const firstRowCols = lines[1].split(',');
+    expect(firstRowCols.length).toBe(2);
+  });
+
+  test('ignores unknown fields and falls back to defaults if none valid', async () => {
+    const { req, res } = createMockReqRes({ fields: 'doesNotExist___' });
+    await exportHandler.default(req, res);
+    expect(res._status).toBe(200);
+    const header = String(res._data).split(/\r?\n/)[0];
+    // Default header should contain common keys like sku and name
+    expect(header.includes('sku')).toBe(true);
+    expect(header.includes('name')).toBe(true);
+  });
+});
