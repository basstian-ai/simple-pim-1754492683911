import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome to Simple PIM</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
