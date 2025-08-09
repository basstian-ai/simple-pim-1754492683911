/*
  Minimal smoke test for the Attribute Groups admin page. This test is not wired
  to any runner by default, but serves as a starting point if Jest/RTL is enabled.
*/
import React from 'react';
// Relative import from test file to page component
import Page from '../pages/admin/attribute-groups';
import { render, screen, fireEvent } from '@testing-library/react';

function ensureLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!window.localStorage) {
    const store = {};
    window.localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
    };
  }
}

describe('Attribute Groups Page', () => {
  it('renders and allows adding a group', () => {
    ensureLocalStorage();
    render(<Page />);
    expect(screen.getByTestId('attribute-groups-page')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Group name (e.g., Technical Specs)');
    fireEvent.change(input, { target: { value: 'Materials' } });
    fireEvent.click(screen.getByTestId('add-group'));
    // New group should appear in list
    expect(screen.getByDisplayValue('Materials')).toBeInTheDocument();
  });
});
