import { render, screen } from '@testing-library/react';
import HomePage from '../pages/index';

const mockProducts = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    variants: [
      { id: 'v1', name: 'Variant 1', price: 90 },
      { id: 'v2', name: 'Variant 2', price: 95 },
    ],
  },
];

test('renders product with variants', () => {
  render(<HomePage products={mockProducts} />);
  expect(screen.getByText(/Product Inventory Management/i)).toBeInTheDocument();
  expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Variant 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Variant 2/i)).toBeInTheDocument();
});
