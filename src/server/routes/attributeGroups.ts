import express, { Request, Response } from 'express';
import { searchAttributeGroups } from '../services/attributeGroupService';

const router = express.Router();

// GET /api/attribute-groups
// Query params supported:
// - code (substring)
// - label (substring)
// - type (exact)
// - required (true|false)
// - page (number, default 1)
// - perPage (number, default 25, capped at 100)
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query;

    const code = typeof q.code === 'string' ? q.code : undefined;
    const label = typeof q.label === 'string' ? q.label : undefined;
    const type = typeof q.type === 'string' ? q.type : undefined;

    let required: boolean | undefined;
    if (typeof q.required === 'string') {
      const v = q.required.toLowerCase();
      if (v === 'true') required = true;
      else if (v === 'false') required = false;
    }

    const page = q.page ? parseInt(String(q.page), 10) || 1 : 1;
    let perPage = q.perPage ? parseInt(String(q.perPage), 10) || 25 : 25;

    // Guardrails
    if (perPage > 100) perPage = 100;
    if (page < 1) return res.status(400).json({ error: 'page must be >= 1' });

    const result = await searchAttributeGroups({ code, label, type, required, page, perPage });

    return res.json(result);
  } catch (err) {
    // Robust error handling: log and return a safe error to clients
    // eslint-disable-next-line no-console
    console.error('attribute-groups search error:', err);
    return res.status(500).json({ error: 'Failed to search attribute groups' });
  }
});

export default router;
