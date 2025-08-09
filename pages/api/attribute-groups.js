import { IncomingMessage, ServerResponse } from 'http';
const store = require('../../lib/attributeGroupsStore');

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req = /** @type {IncomingMessage} */(null), res = /** @type {ServerResponse} */(null)) {
  const { method, query } = req;

  try {
    if (method === 'GET') {
      const { id } = query || {};
      if (id) {
        const item = store.get(String(id));
        if (!item) return sendJson(res, 404, { error: 'Attribute group not found' });
        return sendJson(res, 200, item);
      }
      const items = store.list();
      return sendJson(res, 200, { items });
    }

    if (method === 'POST') {
      const { name, attributes } = req.body || {};
      if (!name || typeof name !== 'string') {
        return sendJson(res, 400, { error: 'name is required' });
      }
      const created = store.create({ name, attributes: Array.isArray(attributes) ? attributes : [] });
      return sendJson(res, 201, created);
    }

    if (method === 'PUT') {
      const id = (query && query.id) || (req.body && req.body.id);
      if (!id) return sendJson(res, 400, { error: 'id is required' });
      const updated = store.update(String(id), req.body || {});
      if (!updated) return sendJson(res, 404, { error: 'Attribute group not found' });
      return sendJson(res, 200, updated);
    }

    if (method === 'DELETE') {
      const id = (query && query.id) || (req.body && req.body.id);
      if (!id) return sendJson(res, 400, { error: 'id is required' });
      const ok = store.remove(String(id));
      if (!ok) return sendJson(res, 404, { error: 'Attribute group not found' });
      return sendJson(res, 204, {});
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /attribute-groups error', err);
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
}
