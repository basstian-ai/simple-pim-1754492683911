const { listGroups, createGroup } = require('../store/attributeGroups');

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = listGroups();
      res.setHeader && res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ ok: true, data });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const created = createGroup({
        code: body.code,
        name: body.name,
        attributes: Array.isArray(body.attributes) ? body.attributes : []
      });
      res.setHeader && res.setHeader('Content-Type', 'application/json');
      return res.status(201).json({ ok: true, data: created });
    }

    res.setHeader && res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ ok: false, error: err.message || 'Unexpected error' });
  }
}

module.exports = { handler };
