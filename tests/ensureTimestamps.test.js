import { ensureTimestamps, addTimestampsToProducts } from '../lib/ensureTimestamps';

describe('ensureTimestamps', () => {
  test('adds createdAt and updatedAt when missing', () => {
    const p = { sku: 'SKU1', name: 'Test product' };
    const out = ensureTimestamps(p);
    expect(out).not.toBe(p); // should not mutate
    expect(typeof out.createdAt).toBe('string');
    expect(typeof out.updatedAt).toBe('string');
    const c = new Date(out.createdAt).getTime();
    const u = new Date(out.updatedAt).getTime();
    expect(Number.isFinite(c)).toBe(true);
    expect(Number.isFinite(u)).toBe(true);
    expect(u >= c).toBe(true);
  });

  test('preserves provided timestamps if valid', () => {
    const p = { sku: 'SKU2', createdAt: '2020-01-01T00:00:00.000Z', updatedAt: '2020-01-02T00:00:00.000Z' };
    const out = ensureTimestamps(p);
    expect(out.createdAt).toBe(p.createdAt);
    expect(out.updatedAt).toBe(p.updatedAt);
  });

  test('fixes updatedAt if older than createdAt', () => {
    const p = { sku: 'SKU3', createdAt: '2021-01-10T00:00:00.000Z', updatedAt: '2020-01-01T00:00:00.000Z' };
    const out = ensureTimestamps(p);
    expect(new Date(out.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(out.createdAt).getTime());
  });

  test('addTimestampsToProducts maps arrays', () => {
    const arr = [ { sku: 'A' }, { sku: 'B', createdAt: '2022-02-02T00:00:00.000Z' } ];
    const out = addTimestampsToProducts(arr);
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBe(2);
    out.forEach(p => {
      expect(typeof p.createdAt).toBe('string');
      expect(typeof p.updatedAt).toBe('string');
    });
  });
});
