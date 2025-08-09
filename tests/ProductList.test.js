import { render, screen } from '@testing-library/react';
import ProductList from '../components/ProductList';

test('renders product list', () => {
  const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
  render(<ProductList products={products} />);
  expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
});
