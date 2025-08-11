import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock next/router used by the page
jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', query: {}, replace: jest.fn() }),
}));

// Ensure fetch is available and predictable for the component effects
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (typeof url === 'string' && url.startsWith('/api/tags')) {
      return Promise.resolve({ json: () => Promise.resolve([]) });
    }
    if (typeof url === 'string' && url.startsWith('/api/products')) {
      return Promise.resolve({ json: () => Promise.resolve([]) });
    }
    return Promise.resolve({ json: () => Promise.resolve([]) });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows Clear filters button when search/in-stock/tags active and clears them', async () => {
  const Home = require('../pages/index').default;

  render(<Home />);

  const input = screen.getByPlaceholderText('Search products by name, SKU or description...');
  expect(input).toBeInTheDocument();

  // Type into the search input to activate filters
  fireEvent.change(input, { target: { value: 'apple' } });
  expect(input.value).toBe('apple');

  // The Clear filters button should appear
  const clearBtn = await screen.findByRole('button', { name: /clear filters/i });
  expect(clearBtn).toBeInTheDocument();

  // Click it and assert the input is cleared
  fireEvent.click(clearBtn);
  await waitFor(() => expect(input.value).toBe(''));
});
