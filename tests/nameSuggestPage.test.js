import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NameSuggestTool from '../pages/tools/name-suggest';

describe('NameSuggest tool page', () => {
  afterEach(() => {
    global.fetch && delete global.fetch;
  });

  it('submits keywords and shows suggestions', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ['Alpha', 'Beta', 'Gamma'] });

    render(<NameSuggestTool />);

    const input = screen.getByPlaceholderText(/Enter keywords/i);
    fireEvent.change(input, { target: { value: 'eco bottle' } });

    const btn = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(btn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(await screen.findByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });
});
