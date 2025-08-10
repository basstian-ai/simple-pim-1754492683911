'use strict';

const {
  getGroup,
  updateGroup,
  deleteGroup,
  validateGroupPayload,
} = require('../../../lib/attributeGroups');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { id } = req.query || {};

  if (req.method === 'GET') {
    const g = getGroup(id);
    if (!g) {
      res.status(404).json({ error: 'Not Found' });
      return;
    }
    res.status(200).json({ data: g });
    return;
  }

  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const { valid, errors } = validateGroupPayload(body);
      if (!valid) {
        res.status(400).json({ error: 'Validation failed', details: errors });
        return;
      }
      const updated = updateGroup(id, body);
      res.status(200).json({ data: updated });
      return;
    } catch (e) {
      if (e && e.code === 'NOT_FOUND') {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      if (e && e.code === 'DUPLICATE_NAME') {
        res.status(409).json({ error: e.message });
        return;
      }
      if (e && e.code === 'VALIDATION_ERROR') {
        res.status(400).json({ error: e.message, details: e.details || [] });
        return;
      }
      console.error(`PUT /api/attribute-groups/${id} error`, e);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  if (req.method === 'DELETE') {
    try {
      deleteGroup(id);
      res.status(204).end();
      return;
    } catch (e) {
      if (e && e.code === 'NOT_FOUND') {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      console.error(`DELETE /api/attribute-groups/${id} error`, e);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).json({ error: 'Method Not Allowed' });
};
