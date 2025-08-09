// Simple in-memory Attribute Groups API for the PIM
// Provides GET (list) and POST (create) endpoints.

const initialGroups = [
  {
    id: 1,
    code: "basic",
    name: "Basic",
    attributes: [
      { code: "sku", name: "SKU", type: "text" },
      { code: "name", name: "Name", type: "text" }
    ]
  },
  {
    id: 2,
    code: "pricing",
    name: "Pricing",
    attributes: [
      { code: "price", name: "Price", type: "number" }
    ]
  }
];

let store = {
  groups: initialGroups.map(g => ({ ...g })),
  nextId: initialGroups.length + 1
};

function getStore() {
  return store;
}

function resetStore() {
  store = {
    groups: initialGroups.map(g => ({ ...g, attributes: g.attributes.map(a => ({ ...a })) })),
    nextId: initialGroups.length + 1
  };
}

function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) {
      return resolve(req.body);
    }
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

async function handler(req, res) {
  // Minimal CORS friendliness (same-origin is default; this just avoids console noise if someone calls from elsewhere)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(store.groups));
    return;
  }

  if (req.method === "POST") {
    const body = await parseBody(req);
    const { code, name, attributes } = body || {};

    if (!code || !name) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing required fields: code, name" }));
      return;
    }

    if (store.groups.some((g) => g.code === code)) {
      res.statusCode = 409;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Attribute group code already exists" }));
      return;
    }

    const sanitizedAttributes = Array.isArray(attributes)
      ? attributes
          .filter((a) => a && a.code && a.name)
          .map((a) => ({ code: String(a.code), name: String(a.name), type: a.type ? String(a.type) : "text" }))
      : [];

    const newGroup = {
      id: store.nextId++,
      code: String(code),
      name: String(name),
      attributes: sanitizedAttributes
    };

    store.groups.push(newGroup);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newGroup));
    return;
  }

  res.statusCode = 405;
  res.setHeader("Allow", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}

// Export in a way that's friendly to both Next.js and Node tests
module.exports = Object.assign(handler, { getStore, resetStore, default: handler });
