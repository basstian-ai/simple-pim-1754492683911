/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index';

// Mock fetch to avoid network calls during tests
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

afterAll(() => {
  global.fetch && (global.fetch = undefined);
});

describe('Export CSV link on Home page', () => {
  it('renders an Export CSV link with base href', async () => {
    render(<Home />);
    const link = await screen.findByRole('link', { name: /export csv/i });
    expect(link).toBeInTheDocument();
    // JSDOM returns absolute URLs; check it ends with the path we expect
    expect(link.getAttribute('href')).toMatch(/^\/api\/products\/export(\?.*)?$/);
  });

  it('includes search query in Export CSV href when searching', async () => {
    render(<Home />);
    const input = screen.getByRole('searchbox', { name: /search products/i });
    fireEvent.change(input, { target: { value: 'shoes' } });
    const link = await screen.findByRole('link', { name: /export csv/i });
    expect(link.getAttribute('href')).toBe('/api/products/export?search=shoes');
  });
});
