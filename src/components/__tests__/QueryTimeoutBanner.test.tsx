import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryTimeoutBanner from '../QueryTimeoutBanner';

describe('QueryTimeoutBanner', () => {
  test('does not render when limitMs is not provided', () => {
    render(<QueryTimeoutBanner durationMs={500} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('does not render when duration is below 75% threshold', () => {
    render(<QueryTimeoutBanner durationMs={700} limitMs={1000} />);
    // 700ms is 70% of 1000ms -> below 75%
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('renders approaching banner when duration >= 75% of limit', () => {
    render(<QueryTimeoutBanner durationMs={760} limitMs={1000} docsUrl="/help" />);
    const banner = screen.getByRole('status');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText(/approaching duration limit/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick optimization tips/i)).toHaveAttribute('href', '/help');
  });

  test('renders exceeded banner when duration >= limit and Run diagnostics is clickable', () => {
    const onOptimize = jest.fn();
    render(<QueryTimeoutBanner durationMs={1200} limitMs={1000} onOptimizeClick={onOptimize} />);
    expect(screen.getByText(/Query duration limit reached/i)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Run diagnostics/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(onOptimize).toHaveBeenCalled();
  });

  test('disables Run diagnostics when no handler provided', () => {
    render(<QueryTimeoutBanner durationMs={800} limitMs={1000} />);
    const btn = screen.getByRole('button', { name: /Run diagnostics/i });
    expect(btn).toBeDisabled();
  });
});
