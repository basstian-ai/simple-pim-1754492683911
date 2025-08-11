import productsData from '../../../data/products.json';

export default function handler(req, res) {
  try {
    const products = Array.isArray(productsData) ? productsData : [];

    const totalProducts = products.length;
    let totalVariants = 0;
    const productsWithVariants = [];
    const variantsByProduct = {};
    const attributeValueCounts = {};

    products.forEach((p) => {
      const sku = p.sku || p.id || p.name || 'unknown';
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const vCount = variants.length;

      totalVariants += vCount;
      if (vCount > 0) productsWithVariants.push(sku);
      variantsByProduct[sku] = vCount;

      variants.forEach((v) => {
        const attrs = v.attributes || {};
        Object.keys(attrs).forEach((attrKey) => {
          const val = attrs[attrKey];
          if (val == null) return;
          attributeValueCounts[attrKey] = attributeValueCounts[attrKey] || {};
          attributeValueCounts[attrKey][String(val)] = (attributeValueCounts[attrKey][String(val)] || 0) + 1;
        });
      });
    });

    res.status(200).json({
      totalProducts,
      totalVariants,
      productsWithVariants: productsWithVariants.length,
      variantsByProduct,
      attributeValueCounts,
    });
  } catch (err) {
    // Keep error shape consistent for clients
    res.status(500).json({ error: String(err) });
  }
}
