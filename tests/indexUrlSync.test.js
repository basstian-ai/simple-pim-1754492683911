/* eslint-env jest */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Home from '../pages/index';

function setLocation(search = '') {
  const url = `http://localhost/${search ? '?' + search : ''}`;
  delete window.location;
  // @ts-ignore
  window.location = new URL(url);
}

describe('Home page URL sync', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn()
      // first call: tags
      .mockResolvedValueOnce({ json: async () => ['Sale', 'New'] })
      // second call: products
      .mockResolvedValueOnce({ json: async () => [] });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('initializes filters from URL and fetches products with those filters', async () => {
    setLocation('tags=Tag1,Tag2&search=foo&inStock=1');

    render(<Home />);

    // advance debounce timer
    await waitFor(() => {
      // fetch should be called at least twice: /api/tags then /api/products?...
      expect(global.fetch).toHaveBeenCalled();
    });

    // The last call should be products with expected query params
    const lastCallUrl = (global.fetch).mock.calls.pop()[0];
    expect(lastCallUrl).toContain('/api/products');
    expect(lastCallUrl).toContain('search=foo');
    expect(lastCallUrl).toContain('tags=Tag1,Tag2');
    expect(lastCallUrl).toContain('inStock=1');
  });
});
