const api = require("../pages/api/attribute-groups");
const assert = require("assert");

function runApi(method, body) {
  return new Promise((resolve) => {
    const req = {
      method,
      headers: { "content-type": "application/json" },
      body,
      on: () => {}, // for parseBody fallback
    };

    const res = {
      statusCode: 200,
      headers: {},
      setHeader(key, val) {
        this.headers[key.toLowerCase()] = val;
      },
      end(payload) {
        let data = payload;
        try { data = JSON.parse(payload); } catch {}
        resolve({ status: this.statusCode, data });
      }
    };

    // Mirror res.status(...).json(...) semantics
    res.status = function (code) { this.statusCode = code; return this; };
    res.json = function (obj) { this.setHeader("content-type", "application/json"); this.end(JSON.stringify(obj)); };

    Promise.resolve(api(req, res)).catch((e) => {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e && e.message ? e.message : String(e) }));
    });
  });
}

(async function main() {
  // Reset store to a known state
  if (typeof api.resetStore === "function") api.resetStore();

  // GET should return initial groups
  const r1 = await runApi("GET");
  assert.strictEqual(r1.status, 200, "GET should be 200");
  assert.ok(Array.isArray(r1.data), "GET should return an array");
  assert.ok(r1.data.length >= 2, "Should have seeded groups");

  // POST should create a new group
  const code = "specs";
  const name = "Specifications";
  const r2 = await runApi("POST", { code, name, attributes: [{ code: "weight", name: "Weight", type: "text" }] });
  assert.strictEqual(r2.status, 201, "POST should be 201");
  assert.strictEqual(r2.data.code, code, "Created group should echo code");
  assert.strictEqual(r2.data.name, name, "Created group should echo name");
  assert.ok(r2.data.id, "Created group should have id");

  // GET again should include new group
  const r3 = await runApi("GET");
  assert.ok(r3.data.some((g) => g.code === code), "List should include created group");

  // Duplicate code should 409
  const r4 = await runApi("POST", { code, name: "Dup" });
  assert.strictEqual(r4.status, 409, "Duplicate code should be conflict");

  // Missing fields should 400
  const r5 = await runApi("POST", { name: "No Code" });
  assert.strictEqual(r5.status, 400, "Missing fields should be bad request");

  // eslint-disable-next-line no-console
  console.log("attribute-groups.test.js passed");
})().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
