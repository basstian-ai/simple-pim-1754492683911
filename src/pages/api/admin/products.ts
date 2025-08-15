import { NextApiRequest, NextApiResponse } from 'next'

// Sample mocked product data so the page + tests can run without a DB
const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Classic Tee', sku: 'CT-001', tag: 'clothing', inStock: true, price: 19.99 },
  { id: 'p2', name: 'Sneakers', sku: 'SN-123', tag: 'shoes', inStock: false, price: 59.99 },
  { id: 'p3', name: 'Socks (3 pack)', sku: 'SO-333', tag: 'clothing', inStock: true, price: 9.99 },
  { id: 'p4', name: 'Water Bottle', sku: 'WB-444', tag: 'accessories', inStock: true, price: 12.0 }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search, tag, inStock } = req.query

  let out = SAMPLE_PRODUCTS.slice()

  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim()
    out = out.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }
  if (typeof tag === 'string' && tag.trim()) {
    out = out.filter((p) => p.tag === tag)
  }
  if (inStock === '1' || inStock === 'true') {
    out = out.filter((p) => p.inStock)
  }

  // Simulate network latency for more realistic integration testing behavior
  setTimeout(() => res.status(200).json(out), 30)
}
