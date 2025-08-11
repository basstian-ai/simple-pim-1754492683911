const store = require("../../../lib/productsStore");

function ok(res, data) {
  res.status(200).json({ ok: true, data });
}
function bad(res, status, message) {
  res.status(status).json({ ok: false, error: { message } });
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const items = store.list();
    return ok(res, items);
  }

  if (req.method === "POST") {
    try {
      const { name, sku, price, currency, description, attributes, variants, media, slug } = req.body || {};
      if (!name || !sku) return bad(res, 400, "name and sku are required");
      const created = store.create({ name, sku, price, currency, description, attributes, variants, media, slug });
      return ok(res, created);
    } catch (e) {
      return bad(res, 400, "Invalid JSON body");
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, ...patch } = req.body || {};
      if (!id) return bad(res, 400, "id is required");
      const updated = store.update(id, patch);
      if (!updated) return bad(res, 404, "Product not found");
      return ok(res, updated);
    } catch (e) {
      return bad(res, 400, "Invalid JSON body");
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id || typeof id !== "string") return bad(res, 400, "id query param is required");
    const removed = store.remove(id);
    if (!removed) return bad(res, 404, "Product not found");
    return ok(res, { id });
  }

  res.setHeader("Allow", "GET,POST,PUT,DELETE");
  return bad(res, 405, "Method Not Allowed");
}
