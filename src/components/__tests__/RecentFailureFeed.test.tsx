import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentFailureFeed, { Failure } from '../RecentFailureFeed';

describe('RecentFailureFeed', () => {
  test('renders empty state when no failures and contains docs link and refresh', () => {
    const onRefresh = jest.fn();
    render(<RecentFailureFeed failures={[]} onRefresh={onRefresh} />);

    expect(screen.getByRole('region', { name: /Recent Failure Feed/i })).toBeInTheDocument();
    expect(screen.getByText(/All clear/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh failures|Refresh/i })).toBeInTheDocument();

    const docsLink = screen.getByRole('link', { name: /Open Publish Health docs/i }) as HTMLAnchorElement;
    expect(docsLink).toBeInTheDocument();
    expect(docsLink.href).toMatch(/\/docs\/publish-health$/);

    fireEvent.click(screen.getByRole('button', { name: /Refresh failures|Refresh/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  test('renders list of failures when provided', () => {
    const failures: Failure[] = [
      { id: 'job-1', channel: 'Shopify', message: '401 Unauthorized', timestamp: '2025-08-15T09:00:00Z' },
      { id: 'job-2', channel: 'Magento', message: 'Payload validation failed' },
    ];

    render(<RecentFailureFeed failures={failures} />);

    expect(screen.queryByText(/All clear/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('failure-item-job-1')).toBeInTheDocument();
    expect(screen.getByTestId('failure-item-job-2')).toBeInTheDocument();
    expect(screen.getByText(/401 Unauthorized/i)).toBeInTheDocument();
    expect(screen.getByText(/Payload validation failed/i)).toBeInTheDocument();
  });
});
