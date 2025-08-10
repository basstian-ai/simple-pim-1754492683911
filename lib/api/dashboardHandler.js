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

    res.status(200).json({
      totalProducts,
      inStock,
      outOfStock: Math.max(0, totalProducts - inStock),
      totalTags: Object.keys(tagCounts).length,
      topTags,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to compute dashboard stats' });
  }
}
