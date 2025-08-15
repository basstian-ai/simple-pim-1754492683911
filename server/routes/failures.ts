import express from 'express';
import { fetchRecentFailures } from '../services/failuresService';

const router = express.Router();

// GET /api/failures?limit=20&cursor=<ts_id>
router.get('/', async (req, res) => {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam as number, 100)) : 20;
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;

    // Expect a DB instance attached to the express app (common pattern)
    const db = req.app.get('db');
    if (!db || typeof db.query !== 'function') {
      return res.status(500).json({ message: 'DB not configured' });
    }

    const result = await fetchRecentFailures(db, limit, cursor);
    res.json(result);
  } catch (err) {
    // Minimal safe error surface - do not leak internals
    console.error('Failed to fetch recent failures', err);
    res.status(500).json({ message: 'Failed to fetch recent failures' });
  }
});

export default router;
