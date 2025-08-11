import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExportCsvLink from '../components/ExportCsvLink';

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      pathname: '/',
      query: { search: 'mug', tags: 'red,large', inStock: '1' },
      replace: jest.fn(),
    }),
  };
});

describe('ExportCsvLink filter propagation', () => {
  it('includes current filters from router.query in the export href', () => {
    render(<ExportCsvLink />);
    const link = screen.getByTestId('export-csv-link');
    const href = link.getAttribute('href');
    expect(href).toContain('/api/products/export');
    expect(href).toContain('search=mug');
    // comma should be URL encoded in query string
    expect(href).toContain('tags=red%2Clarge');
    expect(href).toContain('inStock=1');
  });
});
