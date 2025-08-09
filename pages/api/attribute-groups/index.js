"use strict";

const store = require("../../../lib/attributeGroupsStore");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  const { method } = req;

  try {
    if (method === "GET") {
      const groups = store.listGroups();
      res.statusCode = 200;
      res.end(JSON.stringify({ items: groups, count: groups.length }));
      return;
    }

    if (method === "POST") {
      const body = req.body || {};
      const created = store.createGroup(body);
      res.statusCode = 201;
      res.end(JSON.stringify(created));
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.statusCode = 405;
    res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (err) {
    const status = err && err.statusCode ? err.statusCode : 500;
    res.statusCode = status;
    res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
  }
};
