import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TagsStatsPage from '../pages/admin/tags-stats';

describe('Admin Tag Stats Page', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ counts: { shoes: 3, sale: 2 }, top: [{ tag: 'shoes', count: 3 }, { tag: 'sale', count: 2 }] }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders tag stats heading and items', async () => {
    render(<TagsStatsPage />);
    expect(screen.getByText('Tag Stats')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('shoes')).toBeInTheDocument();
      expect(screen.getByText(/3 products?/)).toBeInTheDocument();
    });
  });
});
