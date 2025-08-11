const fs = require('fs');
const path = require('path');

function loadAttributes() {
  try {
    const p = path.join(process.cwd(), 'data', 'attributes.json');
    const raw = fs.readFileSync(p, 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    return {
      groups: [],
      updatedAt: new Date(0).toISOString(),
      error: 'Sample attributes not found',
    };
  }
}

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handler(req, res) {
  allowCors(res);
  const { method } = req;

  if (method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (method === 'GET') {
    const data = loadAttributes();
    res.status(200).json(data);
    return;
  }

  if (method === 'POST' || method === 'PUT') {
    // Demo-only: echo back without persisting
    const incoming = req.body || {};
    res.status(202).json({
      ok: true,
      persisted: false,
      message: 'Demo mode: changes are not persisted on the server. Use local save in the admin UI.',
      data: incoming,
      serverSample: loadAttributes(),
    });
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

module.exports = handler;
module.exports.default = handler;
