import express, { Request, Response, NextFunction } from 'express';
import { searchAttributeGroups } from '../services/attributeGroupsService';

const router = express.Router();

// GET /api/attribute-groups
// Query params: code, label, type, required (true|false), page, pageSize
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, label, type, required, page, pageSize } = req.query;

    const filters: any = {};
    if (typeof code === 'string' && code.trim() !== '') filters.code = code;
    if (typeof label === 'string' && label.trim() !== '') filters.label = label;
    if (typeof type === 'string' && type.trim() !== '') filters.type = type;
    if (typeof required === 'string') {
      if (required === 'true') filters.required = true;
      else if (required === 'false') filters.required = false;
    }

    const p = page ? parseInt(String(page), 10) : 1;
    const ps = pageSize ? parseInt(String(pageSize), 10) : 10;

    const result = searchAttributeGroups(filters, p, ps);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
