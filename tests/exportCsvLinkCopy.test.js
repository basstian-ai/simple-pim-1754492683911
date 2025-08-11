import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ExportCsvLink from '../components/ExportCsvLink';

// Mock next/router to provide query params used to build the export URL
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from 'next/router';

beforeEach(() => {
  // Provide a router with filters similar to the app
  useRouter.mockImplementation(() => ({ pathname: '/', query: { search: 'shirt', tags: 'sale,summer', inStock: '1' } }));

  // Mock clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(),
    },
    configurable: true,
  });

  // Ensure window.location.origin exists
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'http://localhost',
    },
    configurable: true,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('copies export URL including filters to clipboard and shows feedback', async () => {
  const { getByRole, getByText } = render(<ExportCsvLink />);

  const button = getByRole('button', { name: /Copy export URL/i });

  fireEvent.click(button);

  await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1));

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    'http://localhost/api/products/export?search=shirt&tags=sale%2Csummer&inStock=1'
  );

  // The button label should update to "Copied!" after successful copy
  expect(getByText('Copied!')).toBeTruthy();
});
