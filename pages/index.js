import React from 'react';
import products from '../data/products.json';

const HomePage = () => {
  return (
    <div>
      <h1>Product Inventory Management</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3>Variants:</h3>
                <ul>
                  {product.variants.map((variant) => (
                    <li key={variant.id}>{variant.name} - Price: ${variant.price}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;