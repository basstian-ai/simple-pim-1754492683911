"use strict";

const store = require("../../../lib/attributeGroupsStore");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  const {
    query: { id },
    method,
  } = req;

  try {
    if (method === "GET") {
      const group = store.getGroup(id);
      if (!group) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(group));
      return;
    }

    if (method === "PUT" || method === "PATCH") {
      const body = req.body || {};
      const updated = store.updateGroup(id, body);
      res.statusCode = 200;
      res.end(JSON.stringify(updated));
      return;
    }

    if (method === "DELETE") {
      const ok = store.deleteGroup(id);
      if (!ok) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
      }
      res.statusCode = 204;
      res.end("");
      return;
    }

    res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (err) {
    const status = err && err.statusCode ? err.statusCode : 500;
    res.statusCode = status;
    res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
  }
};
