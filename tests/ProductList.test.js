// tests/ProductList.test.js
import { render, screen } from '@testing-library/react';
import ProductList from '../components/ProductList';

test('renders product list', () => {
  const products = [{ id: 1, name: 'Product 1' }];
  render(<ProductList products={products} />);
  const linkElement = screen.getByText(/Product 1/i);
  expect(linkElement).toBeInTheDocument();
});
