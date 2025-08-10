export default async function dashboardHandler(req, res) {
  try {
    // Load products from lib/products with flexible export resolution
    let productsModule = require('../products');
    productsModule = productsModule && productsModule.default ? productsModule.default : productsModule;

    let products;
    if (productsModule && typeof productsModule.getProducts === 'function') {
      products = productsModule.getProducts();
      if (products && typeof products.then === 'function') products = await products;
    } else if (Array.isArray(productsModule)) {
      products = productsModule;
    } else if (productsModule && Array.isArray(productsModule.products)) {
      products = productsModule.products;
    } else {
      products = [];
    }

    // Resolve isInStock util with graceful fallback
    let isInStockMod = {};
    try {
      isInStockMod = require('../isInStock');
    } catch (_) {}
    const isInStockFn =
      (isInStockMod && (isInStockMod.isInStock || isInStockMod.default)) ||
      function (p) {
        const qty = typeof (p && p.stock) === 'number' ? p.stock : typeof (p && p.quantity) === 'number' ? p.quantity : 0;
        return Boolean((p && p.inStock) || qty > 0);
      };

    const totalProducts = Array.isArray(products) ? products.length : 0;
    const inStock = products.filter((p) => {
      try {
        return !!isInStockFn(p);
      } catch (_) {
        return false;
      }
    }).length;

    const tagCounts = {};
    for (const p of products) {
      const tags = (p && p.tags) || [];
      if (Array.isArray(tags)) {
        for (const t of tags) {
          const tag = String(t);
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    const topTags = Object.keys(tagCounts)
      .map((tag) => ({ tag, count: tagCounts[tag] }))
      .sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag))
      .slice(0, 20);

    // Enrichment status
    const enriched = products.filter((p) => {
      const hasDescription = typeof p?.description === 'string' && p.description.trim() !== '';
      const hasTags = Array.isArray(p?.tags) && p.tags.length > 0;
      const hasPrice = typeof p?.price === 'number';
      return hasDescription && hasTags && hasPrice;
    }).length;

    // Recent activity (fallback to id ordering when no timestamps)
    const recentProducts = products
      .slice()
      .sort((a, b) => {
        const ta = new Date(a.updatedAt || 0).getTime();
        const tb = new Date(b.updatedAt || 0).getTime();
        if (tb === ta) return (b.id || 0) - (a.id || 0);
        return tb - ta;
      })
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, updatedAt: p.updatedAt || null }));

    res.status(200).json({
      totalProducts,
      inStock,
      outOfStock: Math.max(0, totalProducts - inStock),
      totalTags: Object.keys(tagCounts).length,
      topTags,
      enriched,
      notEnriched: Math.max(0, totalProducts - enriched),
      recentProducts,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to compute dashboard stats' });
  }
}
