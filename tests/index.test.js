import { render, screen } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
  test('renders product names', () => {
    render(<HomePage />);
    const productA = screen.getByText(/Product A/i);
    const productB = screen.getByText(/Product B/i);
    expect(productA).toBeInTheDocument();
    expect(productB).toBeInTheDocument();
  });

  test('renders product variants', () => {
    render(<HomePage />);
    const variantA1 = screen.getByText(/Variant A1 - Price: \$24.99/i);
    const variantB1 = screen.getByText(/Variant B1 - Price: \$34.99/i);
    expect(variantA1).toBeInTheDocument();
    expect(variantB1).toBeInTheDocument();
  });
});