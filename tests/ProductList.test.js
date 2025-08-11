import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';

describe('ProductList', () => {
  beforeEach(() => {
    // Provide a clipboard mock for tests
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders products and shows Copy SKU button that writes to clipboard', async () => {
    const products = [
      { sku: 'SKU123', name: 'Test product', description: 'A product for testing' },
    ];

    render(<ProductList products={products} />);

    expect(screen.getByText('Test product')).toBeInTheDocument();
    const skuEl = screen.getByTestId('sku-SKU123');
    expect(skuEl).toBeInTheDocument();
    expect(skuEl.textContent).toBe('SKU123');

    const button = screen.getByRole('button', { name: /copy sku sku123/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SKU123');
    });

    // After successful copy, button text should change to Copied!
    expect(button.textContent).toBe('Copied!');
  });

  it('shows friendly message when no products available', () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
