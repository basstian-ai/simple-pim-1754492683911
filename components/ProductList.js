import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <div>
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4>Variants:</h4>
                  <ul>
                    {product.variants.map((variant) => (
                      <li key={variant.id}>{variant.name} - ${variant.price}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
