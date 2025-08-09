import { render, screen } from '@testing-library/react';
import ProductList from './ProductList';

test('renders product list', () => {
  const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
  render(<ProductList products={products} />);
  const linkElement = screen.getByText(/Product List/i);
  expect(linkElement).toBeInTheDocument();
  products.forEach(product => {
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });
});