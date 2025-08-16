import express from 'express';
import request from 'supertest';
import { createAdminTagsRouter } from '../src/routes/adminTags';
import { ProductRepository } from '../src/services/productService';

// Mock repository for tests
const mockRepo: ProductRepository = {
  async getTagsForSkus(skus: string[]) {
    // return current tags for a few known SKUs, otherwise empty
    const map: Record<string, string[]> = {};
    for (const sku of skus) {
      if (sku === 'SKU123') map[sku] = ['red', 'sale'];
      else if (sku === 'SKU456') map[sku] = ['clearance'];
      else map[sku] = [];
    }
    return map;
  },
  async applyTagChanges(changes) {
    // simulate that changes for SKU456 fail while others succeed
    const errors: Array<{ sku: string; error: string }> = [];
    let applied = 0;
    for (const c of changes) {
      if (c.sku === 'SKU456') {
        errors.push({ sku: c.sku, error: 'simulated write failure' });
      } else {
        applied += 1;
      }
    }
    return { applied, errors };
  },
};

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(createAdminTagsRouter(mockRepo));
  return app;
}

describe('Admin Tags API', () => {
  const app = createApp();

  test('preview with skus + add/remove tags computes diffs', async () => {
    const res = await request(app)
      .post('/api/admin/tags/preview')
      .send({ skus: ['SKU123', 'SKU789'], addTags: ['featured', 'red'], removeTags: ['sale'] })
      .expect(200);

    expect(res.body).toHaveProperty('previews');
    const previews = res.body.previews;
    expect(previews).toHaveLength(2);

    const p1 = previews.find((p: any) => p.sku === 'SKU123');
    expect(p1.currentTags).toEqual(expect.arrayContaining(['red', 'sale']));
    // 'featured' should be added, 'red' already exists so not in addTags result, 'sale' should be removed
    expect(p1.addTags).toEqual(['featured']);
    expect(p1.removeTags).toEqual(['sale']);
    expect(p1.resultingTags).toEqual(expect.arrayContaining(['featured', 'red']));

    const p2 = previews.find((p: any) => p.sku === 'SKU789');
    // SKU789 had no tags initially
    expect(p2.currentTags).toEqual([]);
    expect(p2.addTags.sort()).toEqual(['featured', 'red'].sort());
    expect(p2.removeTags).toEqual([]);
  });

  test('preview with per-sku changes', async () => {
    const res = await request(app)
      .post('/api/admin/tags/preview')
      .send({ changes: [{ sku: 'SKU123', addTags: ['new'], removeTags: ['red'] }, { sku: 'SKU456', addTags: ['new'] }] })
      .expect(200);

    const previews = res.body.previews;
    const p1 = previews.find((p: any) => p.sku === 'SKU123');
    expect(p1.currentTags).toEqual(expect.arrayContaining(['red', 'sale']));
    expect(p1.addTags).toEqual(['new']);
    expect(p1.removeTags).toEqual(['red']);

    const p2 = previews.find((p: any) => p.sku === 'SKU456');
    expect(p2.currentTags).toEqual(['clearance']);
    expect(p2.addTags).toEqual(['new']);
  });

  test('apply returns applied count and errors', async () => {
    const res = await request(app)
      .post('/api/admin/tags/apply')
      .send({ changes: [{ sku: 'SKU123', addTags: ['x'] }, { sku: 'SKU456', addTags: ['y'] }] })
      .expect(200);

    expect(res.body).toHaveProperty('result');
    expect(res.body.result.applied).toBe(1); // SKU123 succeeded, SKU456 simulated failure
    expect(res.body.result.errors).toEqual(expect.arrayContaining([{ sku: 'SKU456', error: 'simulated write failure' }]));
  });

  test('preview returns 400 for empty skus array', async () => {
    await request(app).post('/api/admin/tags/preview').send({ skus: [] }).expect(400);
  });

  test('apply returns 400 for missing changes', async () => {
    await request(app).post('/api/admin/tags/apply').send({}).expect(400);
  });
});
