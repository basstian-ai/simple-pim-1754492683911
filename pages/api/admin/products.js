const { getSampleCatalog } = require("../../../lib/sampleData");

export default function handler(req, res) {
  const catalog = getSampleCatalog();
  res.status(200).json({
    success: true,
    attributes: catalog.attributes,
    products: catalog.products,
    meta: {
      count: catalog.products.length,
      generatedAt: new Date().toISOString()
    }
  });
}
