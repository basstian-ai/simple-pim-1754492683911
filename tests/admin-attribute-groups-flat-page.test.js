import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Page from '../pages/admin/attribute-groups-flat';

describe('Admin Attribute Groups Flat page', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        count: 2,
        attributes: [
          { groupId: 'seo', groupName: 'SEO', code: 'meta_title', name: 'Meta Title', type: 'text', required: true },
          { groupId: 'shipping', groupName: 'Shipping', code: 'weight', name: 'Weight', type: 'number', required: false },
        ],
      }),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders flattened attributes and export link', async () => {
    render(<Page />);

    expect(screen.getByText('Attribute Groups (Flat)')).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/attribute-groups/flat'));

    expect(await screen.findByText('Meta Title')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText(/Found 2 attributes/)).toBeInTheDocument();

    const exportLink = screen.getByText('Export CSV');
    expect(exportLink.getAttribute('href')).toBe('/api/attribute-groups/flat/export');
  });
});
