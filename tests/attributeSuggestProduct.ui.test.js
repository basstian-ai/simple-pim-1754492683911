import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../pages/admin/attribute-suggest-product';

describe('Admin Attribute Suggest (Product-based)', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ['color', 'size'],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('submits product details and renders suggestions', async () => {
    render(<Page />);

    const nameInput = screen.getByLabelText('Product name');
    const descInput = screen.getByLabelText('Product description');
    const tagsInput = screen.getByLabelText('Tags');

    fireEvent.change(nameInput, { target: { value: 'Red Cotton T-Shirt' } });
    fireEvent.change(descInput, { target: { value: 'Soft cotton tee in red color' } });
    fireEvent.change(tagsInput, { target: { value: 'apparel, tee, red' } });

    fireEvent.click(screen.getByRole('button', { name: /suggest attributes/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/attributes/suggest-for-product',
        expect.objectContaining({ method: 'POST' })
      );
    });

    // Render suggestions
    expect(await screen.findByText('color')).toBeInTheDocument();
    expect(await screen.findByText('size')).toBeInTheDocument();
  });
});
