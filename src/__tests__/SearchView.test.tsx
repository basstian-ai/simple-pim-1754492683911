import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock the cancellable hook to simulate a timeout state
jest.mock('../hooks/useCancellableQuery', () => {
  return jest.fn(() => ({
    status: 'timeout',
    data: null,
    error: null,
    isTimedOut: true,
    run: jest.fn(),
    retry: jest.fn(),
    cancel: jest.fn(),
  }));
});

import SearchView from '../views/SearchView';
import useCancellableQuery from '../hooks/useCancellableQuery';

describe('SearchView timeout wiring', () => {
  it('shows QueryTimeoutBanner when query times out and hooks up actions', () => {
    const mock = useCancellableQuery as jest.MockedFunction<any>;
    const fake = mock();

    render(<SearchView />);

    // Banner should be visible
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Retry button calls retry
    const retryBtn = screen.getByLabelText('retry-query');
    fireEvent.click(retryBtn);
    expect(fake.retry).toHaveBeenCalled();

    // Narrow button calls run (we expect our mocked run to exist)
    const narrowBtn = screen.getByLabelText('narrow-query');
    fireEvent.click(narrowBtn);
    expect(fake.run).toHaveBeenCalled();

    // Cancel button calls cancel
    const cancelBtn = screen.getByLabelText('cancel-query');
    fireEvent.click(cancelBtn);
    expect(fake.cancel).toHaveBeenCalled();
  });
});
