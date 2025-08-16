const express = require('express');
const router = express.Router();
const mockDb = require('../db/mockDb');
const dashboardService = require('../services/dashboardService');

// GET /api/admin/dashboard
// Query params:
//   ttlMs (optional) - override cache TTL for this request (ms)
router.get('/dashboard', async (req, res) => {
  try {
    const ttlMs = req.query.ttlMs ? parseInt(req.query.ttlMs, 10) : undefined;
    const metrics = await dashboardService.getDashboardMetrics(mockDb, { ttlMs });
    res.json({ ok: true, metrics });
  } catch (err) {
    // Log and return generic error
    // eslint-disable-next-line no-console
    console.error('Failed to compute dashboard metrics', err && err.stack ? err.stack : err);
    res.status(500).json({ ok: false, error: 'Failed to compute dashboard metrics' });
  }
});

module.exports = router;
