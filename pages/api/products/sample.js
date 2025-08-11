const sampleProducts = require("../../../lib/sampleProducts");

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { q } = req.query;
  let products = sampleProducts;

  if (q && typeof q === "string") {
    const term = q.toLowerCase();
    products = sampleProducts.filter((p) =>
      [p.name, p.slug, p.sku]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(term))
    );
  }

  res.status(200).json({ count: products.length, products });
}
