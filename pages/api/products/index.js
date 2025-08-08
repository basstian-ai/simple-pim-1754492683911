import { promises as fs } from 'fs';
import path from 'path';

let products = [];

const loadProducts = async () => {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  products = JSON.parse(fileContents);
};

loadProducts();

export default async (req, res) => {
  if (req.method === 'POST') {
    const product = { id: Date.now(), ...req.body };
    products.push(product);
    await fs.writeFile(path.join(process.cwd(), 'data', 'products.json'), JSON.stringify(products, null, 2));
    res.status(200).json(product);
  } else {
    res.status(200).json(products);
  }
};