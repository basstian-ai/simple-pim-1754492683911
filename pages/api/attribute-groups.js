const fs = require('fs');
const path = require('path');

const dataFile = path.join(process.cwd(), 'data', 'attribute-groups.json');
let groupsCache = null;

function defaultGroups() {
  return [
    { id: 'basic', name: 'Basic Info', attributes: ['name', 'sku', 'price'] },
    { id: 'dimensions', name: 'Dimensions', attributes: ['width', 'height', 'depth', 'weight'] },
  ];
}

function loadGroups() {
  if (Array.isArray(groupsCache)) return groupsCache;
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    groupsCache = Array.isArray(parsed.groups) ? parsed.groups : defaultGroups();
  } catch (e) {
    groupsCache = defaultGroups();
  }
  return groupsCache;
}

function saveGroups(groups) {
  try {
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify({ groups }, null, 2), 'utf8');
  } catch (e) {
    // Ignore write errors (e.g., serverless readonly FS). Data still available in-memory.
  }
}

module.exports = async function handler(req, res) {
  const method = req.method || 'GET';

  if (method === 'GET') {
    const groups = loadGroups();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ groups }));
    return;
  }

  if (method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const name = body && body.name ? String(body.name).trim() : '';
    let attributes = body && body.attributes;

    if (typeof attributes === 'string') {
      attributes = attributes.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(attributes)) attributes = [];

    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'name is required' }));
      return;
    }

    const groups = loadGroups();
    const id = (body && body.id && String(body.id).trim()) || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
    const group = { id, name, attributes };
    groups.push(group);
    groupsCache = groups;
    saveGroups(groups);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ group }));
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.statusCode = 405;
  res.end('Method Not Allowed');
};
