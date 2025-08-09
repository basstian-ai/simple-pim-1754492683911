import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useEffect } from 'react';

const Index = (props) => (
  <Layout>
    <h1>Produkter</h1>
    {props.products.map((product) => (
      <div key={product.id}>
        <h2>{product.name}</h2>
        <p>Category: {product.category || 'N/A'}</p>
        <p>SKU: {product.sku}</p>
        <p>{product.description}</p>
        <p>Price: {product.price}</p>
        <p>Stock: {product.stock || 'N/A'}</p>
        <p>Category: {product.category || 'N/A'}</p>
      </div>
      <hr />
    ))}
    <Link href='/admin'>
      <a>Gå til Admin</a>
    </Link>
  </Layout>
);

Index.getInitialProps = async function() {
  const res = await fetch('/api/products');
  const products = await res.json();
  return { products };
};

export default Index;