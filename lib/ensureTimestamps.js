/*
 * Ensure each product has createdAt and updatedAt timestamps.
 * This module keeps the logic simple and deterministic enough for tests
 * while guaranteeing updatedAt >= createdAt.
 */

function iso(d) {
  return new Date(d).toISOString();
}

// Return a small deterministic offset (ms) based on product SKU or name so
// generated timestamps are stable across runs for the same product.
function deterministicOffset(product) {
  const key = (product.sku || product.name || '').toString();
  let h = 2166136261; // FNV-1a seed
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  // make offset up to ~365 days
  const max = 365 * 24 * 60 * 60 * 1000;
  return Math.abs(h) % max;
}

export function ensureTimestamps(product) {
  // Do not mutate the original product
  const p = Object.assign({}, product);
  try {
    const now = new Date();

    // If createdAt present and valid, use it; otherwise generate a deterministic past date
    let createdAtDate;
    if (p.createdAt) {
      const d = new Date(p.createdAt);
      if (!isNaN(d.getTime())) createdAtDate = d;
    }
    if (!createdAtDate) {
      const offset = deterministicOffset(p);
      createdAtDate = new Date(now.getTime() - offset - 24 * 60 * 60 * 1000); // ensure at least 1 day before now
      p.createdAt = iso(createdAtDate);
    }

    // If updatedAt present and valid, use it; otherwise set to now (or createdAt if that is in future)
    let updatedAtDate;
    if (p.updatedAt) {
      const d = new Date(p.updatedAt);
      if (!isNaN(d.getTime())) updatedAtDate = d;
    }
    if (!updatedAtDate) {
      updatedAtDate = new Date();
      if (updatedAtDate.getTime() < createdAtDate.getTime()) {
        updatedAtDate = new Date(createdAtDate.getTime());
      }
      p.updatedAt = iso(updatedAtDate);
    }

    // Guarantee updatedAt >= createdAt
    if (new Date(p.updatedAt).getTime() < new Date(p.createdAt).getTime()) {
      p.updatedAt = p.createdAt;
    }
  } catch (err) {
    // In case of any unexpected error, fallback to adding simple now timestamps
    const nowIso = new Date().toISOString();
    p.createdAt = p.createdAt || nowIso;
    p.updatedAt = p.updatedAt || nowIso;
  }
  return p;
}

export function addTimestampsToProducts(products) {
  if (!Array.isArray(products)) return products;
  return products.map(ensureTimestamps);
}
