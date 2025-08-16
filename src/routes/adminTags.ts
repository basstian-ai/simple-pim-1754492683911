import express, { Request, Response } from 'express';
import { ProductService, ProductRepository, UnsupportedProductRepository } from '../services/productService';

// Create a router wired to a ProductRepository. If no repo provided, endpoints will return 500 with helpful message.
export function createAdminTagsRouter(repo?: ProductRepository) {
  const router = express.Router();
  const productRepo = repo ?? UnsupportedProductRepository;
  const svc = new ProductService(productRepo);

  // Preview endpoint
  // Accepts either:
  // - { skus: string[], addTags?: string[], removeTags?: string[] }
  // - { changes: [{ sku, addTags?, removeTags? }] }
  router.post('/api/admin/tags/preview', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};

      if (Array.isArray(body.changes)) {
        const changes = body.changes;
        const previews = await svc.previewForChanges(changes);
        return res.json({ previews });
      }

      const skus = Array.isArray(body.skus) ? body.skus : [];
      if (skus.length === 0) return res.status(400).json({ error: 'skus must be a non-empty array' });
      const addTags = Array.isArray(body.addTags) ? body.addTags : [];
      const removeTags = Array.isArray(body.removeTags) ? body.removeTags : [];

      const previews = await svc.previewForSkus(skus, addTags, removeTags);
      return res.json({ previews });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'unexpected error' });
    }
  });

  // Apply endpoint
  // Accepts: { changes: [{ sku, addTags?, removeTags? }] }
  router.post('/api/admin/tags/apply', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};
      if (!Array.isArray(body.changes) || body.changes.length === 0) {
        return res.status(400).json({ error: 'changes must be a non-empty array' });
      }
      const result = await svc.applyChanges(body.changes);
      return res.json({ result });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'unexpected error' });
    }
  });

  return router;
}

// Export a default router instance that will throw informative error until a real repo is wired.
export default createAdminTagsRouter();
