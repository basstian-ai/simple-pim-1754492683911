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
  // Always respond with JSON from this API
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { method } = req;

  if (method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (method === 'GET') {
    const data = loadAttributes();
    // Cache for 60s on the edge, allow stale while revalidating for 5m.
    // Keeps client/server load down for repeated requests to sample data.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
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

export default handler;
