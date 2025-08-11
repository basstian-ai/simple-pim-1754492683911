'use strict';

function normalizeTag(tag) {
  if (tag == null) return '';
  return String(tag).trim();
}

function unique(arr) {
  const set = new Set();
  const out = [];
  for (const v of arr) {
    const k = v; // keep case as-is, uniqueness by exact string
    if (!set.has(k)) {
      set.add(k);
      out.push(v);
    }
  }
  return out;
}

function applyBulkTags(products, ops) {
  const add = Array.isArray(ops && ops.add) ? ops.add.map(normalizeTag).filter(Boolean) : [];
  const remove = Array.isArray(ops && ops.remove) ? ops.remove.map(normalizeTag).filter(Boolean) : [];
  const targetSkus = new Set(
    Array.isArray(ops && ops.skus)
      ? ops.skus.map((s) => String(s).trim()).filter(Boolean)
      : []
  );

  const results = [];
  let matched = 0;
  let updated = 0;
  let addedCount = 0;
  let removedCount = 0;

  for (const p of Array.isArray(products) ? products : []) {
    if (!targetSkus.size || targetSkus.has(p.sku)) {
      matched += 1;
      const before = Array.isArray(p.tags) ? [...p.tags] : [];
      let after = [...before];

      // add
      for (const t of add) {
        if (!after.includes(t)) {
          after.push(t);
          addedCount += 1;
        }
      }

      // remove
      if (remove.length) {
        const sizeBefore = after.length;
        after = after.filter((t) => !remove.includes(t));
        removedCount += sizeBefore - after.length;
      }

      after = unique(after);

      const changed = JSON.stringify(before) !== JSON.stringify(after);
      if (changed) updated += 1;

      results.push({
        sku: p.sku,
        before,
        after,
        added: add.filter((t) => !before.includes(t)),
        removed: remove.filter((t) => before.includes(t))
      });
    }
  }

  return {
    items: results,
    stats: { matched, updated, added: addedCount, removed: removedCount }
  };
}

module.exports = { applyBulkTags };
