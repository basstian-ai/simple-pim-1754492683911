import { render, screen } from '@testing-library/react';
import Index from '../pages/index';

const mockProducts = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description for Product 1',
    price: 29.99,
    variants: [
      { id: 'v1', name: 'Variant 1', price: 29.99 },
      { id: 'v2', name: 'Variant 2', price: 34.99 }
    ]
  }
];

test('renders product variants', () => {
  render(<Index products={mockProducts} />);
  expect(screen.getByText(/Variant 1 - \$29\.99/i)).toBeInTheDocument();
  expect(screen.getByText(/Variant 2 - \$34\.99/i)).toBeInTheDocument();
});
