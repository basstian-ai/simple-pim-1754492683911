import productsData from '../../../data/products.json';
import { computeProductStats } from '../../../lib/productStats';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const stats = computeProductStats(productsData || []);
    return res.status(200).json(stats);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to compute stats' });
  }
}
