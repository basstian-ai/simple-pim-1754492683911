import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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

import ReportsView from '../views/ReportsView';
import useCancellableQuery from '../hooks/useCancellableQuery';

describe('ReportsView timeout wiring', () => {
  it('shows QueryTimeoutBanner and buttons invoke hook actions', () => {
    const mock = useCancellableQuery as jest.MockedFunction<any>;
    const fake = mock();

    render(<ReportsView />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('retry-query'));
    expect(fake.retry).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('narrow-query'));
    expect(fake.run).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('cancel-query'));
    expect(fake.cancel).toHaveBeenCalled();
  });
});
