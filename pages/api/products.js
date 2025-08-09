import { getProducts } from '../../lib/products';

export default async function handler(req, res) {
  const products = await getProducts();
  res.status(200).json(products);
}
