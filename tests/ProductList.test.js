import React from 'react';
import { render } from '@testing-library/react';
import ProductList from '../components/ProductList';

describe('ProductList', () => {
  it('renders product list with variants', () => {
    const products = [
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        variants: [
          { id: '1-1', name: 'Variant 1', price: 90 },
          { id: '1-2', name: 'Variant 2', price: 95 },
        ],
      },
    ];

    const { getByText } = render(<ProductList products={products} />);

    expect(getByText('Product List')).toBeInTheDocument();
    expect(getByText('Product 1')).toBeInTheDocument();
    expect(getByText('Price: $100')).toBeInTheDocument();
    expect(getByText('Variants:')).toBeInTheDocument();
    expect(getByText('Variant 1 - $90')).toBeInTheDocument();
    expect(getByText('Variant 2 - $95')).toBeInTheDocument();
  });
});
