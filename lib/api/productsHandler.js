import { getProducts } from '../products';

export default async function productsHandler(req, res) {
  const { search } = req.query || {};
  const rawTags = (req.query && req.query.tags) || '';

  let tags = [];
  if (typeof rawTags === 'string' && rawTags.trim() !== '') {
    tags = rawTags
      .split(',')
      .map((t) => {
        try {
          return decodeURIComponent(t);
        } catch (e) {
          return t;
        }
      })
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const products = await getProducts({ search, tags });
  res.status(200).json(products);
}
