const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'attribute-groups.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { items: [], updatedAt: new Date(0).toISOString() };
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function loadData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw || '{}');
    if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
      return { items: [], updatedAt: new Date(0).toISOString() };
    }
    return data;
  } catch (e) {
    return { items: [], updatedAt: new Date(0).toISOString() };
  }
}

function saveData(data) {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2));
  return payload;
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueId(desired, existingIds) {
  if (!existingIds.includes(desired)) return desired;
  let i = 2;
  while (existingIds.includes(`${desired}-${i}`)) i += 1;
  return `${desired}-${i}`;
}

function normalizeAttributes(attrs) {
  if (Array.isArray(attrs)) {
    return Array.from(
      new Set(
        attrs
          .map((a) => String(a || '').trim())
          .filter((a) => a.length > 0)
      )
    );
  }
  if (typeof attrs === 'string') {
    return Array.from(
      new Set(
        attrs
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a.length > 0)
      )
    );
  }
  return [];
}

function handler(req, res) {
  const method = (req.method || 'GET').toUpperCase();

  if (method === 'GET') {
    const data = loadData();
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const attrs = normalizeAttributes(body.attributes);

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!attrs.length) {
      return res.status(400).json({ error: 'attributes must be a non-empty array or comma-separated string' });
    }

    const data = loadData();
    const desiredId = slugify(name) || 'group';
    const existingIds = data.items.map((g) => g.id);
    const id = uniqueId(desiredId, existingIds);

    const newGroup = { id, name, attributes: attrs };
    const updated = { ...data, items: [...data.items, newGroup] };
    const saved = saveData(updated);

    return res.status(201).json({ item: newGroup, items: saved.items, updatedAt: saved.updatedAt });
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = req.body || {};
    const id = String(body.id || '').trim();
    if (!id) return res.status(400).json({ error: 'id is required' });

    const data = loadData();
    const idx = data.items.findIndex((g) => g.id === id);
    if (idx === -1) return res.status(404).json({ error: 'attribute group not found' });

    const name = typeof body.name === 'string' ? String(body.name).trim() : data.items[idx].name;
    const attrs = body.attributes !== undefined ? normalizeAttributes(body.attributes) : data.items[idx].attributes;
    if (!name) return res.status(400).json({ error: 'name cannot be empty' });
    if (!attrs.length) return res.status(400).json({ error: 'attributes cannot be empty' });

    const updatedItem = { ...data.items[idx], name, attributes: attrs };
    const updated = { ...data, items: [...data.items.slice(0, idx), updatedItem, ...data.items.slice(idx + 1)] };
    const saved = saveData(updated);

    return res.status(200).json({ item: updatedItem, items: saved.items, updatedAt: saved.updatedAt });
  }

  if (method === 'DELETE') {
    const { id } = req.query || {};
    const targetId = Array.isArray(id) ? id[0] : id;
    if (!targetId) return res.status(400).json({ error: 'id is required as query parameter' });

    const data = loadData();
    const exists = data.items.some((g) => g.id === targetId);
    if (!exists) return res.status(404).json({ error: 'attribute group not found' });

    const updated = { ...data, items: data.items.filter((g) => g.id !== targetId) };
    const saved = saveData(updated);

    return res.status(200).json({ ok: true, items: saved.items, updatedAt: saved.updatedAt });
  }

  res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
}

module.exports = handler;
