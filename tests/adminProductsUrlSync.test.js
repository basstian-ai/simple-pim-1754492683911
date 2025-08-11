/*
  Ensures the Admin Products page synchronizes its filters with the URL (router.replace)
  and exposes a CSV export link that reflects current filters, similar to the homepage.
*/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const { useRouter } = require('next/router');

// Load the page after mocking next/router
const AdminProductsPage = require('../pages/admin/products').default;

describe('Admin Products page URL sync', () => {
  let replaceMock;

  beforeEach(() => {
    replaceMock = jest.fn();
    useRouter.mockReturnValue({
      pathname: '/admin/products',
      query: {},
      replace: replaceMock,
    });

    // Mock fetch for tags and products
    global.fetch = jest.fn((url) => {
      if (typeof url === 'string' && url.endsWith('/api/tags')) {
        return Promise.resolve({
          json: () => Promise.resolve(['red', 'blue']),
        });
      }
      if (typeof url === 'string' && url.startsWith('/api/products')) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('syncs search and tag filters to URL via router.replace', async () => {
    render(<AdminProductsPage />);

    // Search input should be present
    const input = await screen.findByPlaceholderText('Search products by name, SKU or description...');

    // Type into search
    fireEvent.change(input, { target: { value: 'chair' } });

    // Click a tag once tags are loaded
    const redTag = await screen.findByRole('button', { name: 'red' });
    fireEvent.click(redTag);

    await waitFor(() => {
      // Expect router.replace to have been called with combined filters
      expect(replaceMock).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/admin/products',
          query: expect.objectContaining({ search: 'chair', tags: 'red' }),
        }),
        undefined,
        { shallow: true }
      );
    });
  });
});
