import React from 'react';
import fetch from 'isomorphic-unfetch';

const ProductList = ({ products }) => {
  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();

  return {
    props: { products },
  };
}

export default ProductList;