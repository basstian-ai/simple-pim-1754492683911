import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../pages/index';

describe('HomePage', () => {
  test('renders search input and filters products', () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText(/search products.../i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Test Product' } });
    const product = screen.queryByText(/Test Product/i);
    expect(product).toBeInTheDocument();
  });
});