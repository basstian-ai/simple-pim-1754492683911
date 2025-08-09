import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/index';

describe('Home page Export CSV', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders an Export CSV link pointing to the API', () => {
    render(<Home />);
    const link = screen.getByRole('link', { name: /export csv/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toMatch(/^\/api\/products\/export/);
  });
});
