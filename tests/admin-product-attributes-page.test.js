import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter() {
    return { query: { sku: 'SKU-1' } };
  },
}));

import Page from '../pages/admin/product/[sku]/attributes';

describe('Admin Product Attributes (flat) page', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        sku: 'SKU-1',
        count: 2,
        attributes: [
          { groupId: 'seo', groupName: 'SEO', code: 'meta_title', name: 'Meta Title', type: 'text' },
          { groupId: 'shipping', groupName: 'Shipping', code: 'weight', name: 'Weight', type: 'number', unit: 'kg' },
        ],
      }),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders flattened attributes for a product', async () => {
    render(<Page />);

    expect(screen.getByText(/Attributes for/i)).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/products/SKU-1/attributes/flat'));

    expect(await screen.findByText('Meta Title')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText(/Found 2 attributes/)).toBeInTheDocument();
  });
});
