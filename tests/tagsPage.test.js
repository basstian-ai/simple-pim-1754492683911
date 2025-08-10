/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TagsPage from '../pages/tags';

describe('Tags page', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ['Sale', 'New'] });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders tags as links to filtered product list', async () => {
    render(<TagsPage />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Filter products by tag Sale/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Filter products by tag New/i })).toBeInTheDocument();
    });

    const saleLink = screen.getByRole('link', { name: /Sale/i });
    expect(saleLink.getAttribute('href')).toBe('/?tags=Sale');
  });
});
