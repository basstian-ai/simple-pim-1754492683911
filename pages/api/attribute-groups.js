const { readGroups, addGroup, findByName } = require('../../lib/storage/attributeGroups');

async function handler(req, res) {
  // Basic API for attribute groups: GET list, POST create
  if (req.method === 'GET') {
    const groups = readGroups().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(groups));
    return;
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();

    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Name is required' }));
      return;
    }
    if (findByName(name)) {
      res.statusCode = 409;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'An attribute group with this name already exists' }));
      return;
    }

    const created = addGroup({ name, description });
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(created));
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.statusCode = 405;
  res.end('Method Not Allowed');
}

module.exports = handler;
module.exports.default = handler;
