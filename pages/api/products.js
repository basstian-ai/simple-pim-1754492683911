export default async function handler(req, res) {
  const products = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
  ];

  res.status(200).json(products);
}
