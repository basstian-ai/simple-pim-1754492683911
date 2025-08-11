import products from '../../../data/products.json';

// Aggregates attribute counts across all products.
// Returns: { totalProducts, attributeCounts: { [attributeName]: { [value]: count } } }
export default function handler(req, res) {
  try {
    const attributeCounts = {};

    if (!Array.isArray(products)) {
      return res.status(500).json({ error: 'Products data is not an array' });
    }

    products.forEach((product) => {
      const attrs = product.attributes;

      // Support multiple representations: array of { name, value } or object map
      if (Array.isArray(attrs)) {
        attrs.forEach((a) => {
          if (!a) return;
          const name = a.name || a.attribute || a.key;
          const value = a.value != null ? String(a.value) : undefined;
          if (!name || value === undefined) return;

          attributeCounts[name] = attributeCounts[name] || {};
          attributeCounts[name][value] = (attributeCounts[name][value] || 0) + 1;
        });
      } else if (attrs && typeof attrs === 'object') {
        Object.keys(attrs).forEach((name) => {
          let value = attrs[name];
          // normalize arrays by joining values
          if (Array.isArray(value)) value = value.join(',');
          if (value == null) return;
          value = String(value);

          attributeCounts[name] = attributeCounts[name] || {};
          attributeCounts[name][value] = (attributeCounts[name][value] || 0) + 1;
        });
      }
    });

    return res.status(200).json({ totalProducts: products.length, attributeCounts });
  } catch (err) {
    console.error('Error in attributes-summary handler', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
