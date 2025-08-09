import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
  test('renders search input and filters products', () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText(/search products.../i);
    expect(searchInput).toBeInTheDocument();

    // Simulate typing in the search input
    fireEvent.change(searchInput, { target: { value: 'Product A' } });
    const productA = screen.getByText(/Product A/i);
    expect(productA).toBeInTheDocument();

    // Check that other products are not displayed
    const productB = screen.queryByText(/Product B/i);
    expect(productB).not.toBeInTheDocument();
  });
});