import { getProducts } from '../../../lib/products';

export default async function handler(req, res) {
  const { search } = req.query || {};
  const products = await getProducts({ search });
  res.status(200).json(products);
}
