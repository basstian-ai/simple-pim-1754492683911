// Service responsible for computing dashboard metrics with basic in-memory caching.

const DEFAULT_TTL_MS = 30 * 1000; // 30s

// Simple in-memory cache store for this service only.
const cache = {
  value: null,
  expiresAt: 0
};

function _now() {
  return Date.now();
}

async function getDashboardMetrics(db, opts = {}) {
  const ttlMs = typeof opts.ttlMs === 'number' ? opts.ttlMs : DEFAULT_TTL_MS;

  if (cache.value && cache.expiresAt > _now()) {
    return { ...cache.value, cached: true };
  }

  // Fetch concurrently
  try {
    const [products, activities] = await Promise.all([
      db.listProducts(),
      db.listRecentActivity({ limit: 50 })
    ]);

    // Basic aggregations
    const totalProducts = products.length;
    let inStockCount = 0;
    const tagUsage = Object.create(null);

    for (const p of products) {
      if (p.inStock) inStockCount += 1;
      if (Array.isArray(p.tags)) {
        for (const t of p.tags) {
          tagUsage[t] = (tagUsage[t] || 0) + 1;
        }
      }
    }

    // Top tags sorted by count
    const topTags = Object.keys(tagUsage)
      .map((tag) => ({ tag, count: tagUsage[tag] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity sorted desc by timestamp
    const recentActivity = (activities || [])
      .slice()
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 20);

    const result = {
      totalProducts,
      inStockCount,
      topTags,
      recentActivity
    };

    cache.value = result;
    cache.expiresAt = _now() + ttlMs;

    return { ...result, cached: false };
  } catch (err) {
    // Propagate for handler to log/respond
    throw err;
  }
}

function clearCache() {
  cache.value = null;
  cache.expiresAt = 0;
}

module.exports = {
  getDashboardMetrics,
  clearCache
};
