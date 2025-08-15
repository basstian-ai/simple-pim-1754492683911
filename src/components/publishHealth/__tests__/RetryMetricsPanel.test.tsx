import React from 'react';
import { render, screen } from '@testing-library/react';
import RetryMetricsPanel from '../RetryMetricsPanel';
import { RetryMetric } from '../types';

describe('RetryMetricsPanel', () => {
  it('renders metrics rows and drill links when job ids are present', () => {
    const data: RetryMetric[] = [
      {
        channel: 'Shopify',
        totalRetries: 50,
        successAfterRetry: 20,
        maxAttempts: 5,
        sampleJobIds: ['job-1']
      },
      {
        channel: 'Magento',
        totalRetries: 10,
        successAfterRetry: 5,
        maxAttempts: 3,
        sampleJobIds: []
      }
    ];

    render(<RetryMetricsPanel metrics={data} jobBasePath={'/jobs/'} />);

    // headings and channels
    expect(screen.getByRole('heading', { name: /retry metrics/i })).toBeInTheDocument();
    expect(screen.getByText('Shopify')).toBeInTheDocument();
    expect(screen.getByText('Magento')).toBeInTheDocument();

    // total retries numbers
    expect(screen.getByText('50 retries')).toBeInTheDocument();
    expect(screen.getByText('10 retries')).toBeInTheDocument();

    // success-after-retry percentages: Shopify 20/50 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
    // Magento 5/10 = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();

    // Max attempts
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // drill link present for Shopify, absent for Magento (shows em dash)
    const drillShopify = screen.getByTestId('drill-Shopify') as HTMLAnchorElement;
    expect(drillShopify).toBeInTheDocument();
    expect(drillShopify.href).toContain('/jobs/job-1');

    // Magento should show the placeholder (no anchor)
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('normalizes bars relative to max totalRetries', () => {
    const data: RetryMetric[] = [
      { channel: 'A', totalRetries: 1, successAfterRetry: 1, maxAttempts: 1, sampleJobIds: ['a'] },
      { channel: 'B', totalRetries: 100, successAfterRetry: 50, maxAttempts: 10, sampleJobIds: ['b'] }
    ];

    render(<RetryMetricsPanel metrics={data} />);

    const barA = screen.getByTestId('bar-A') as HTMLElement;
    const barB = screen.getByTestId('bar-B') as HTMLElement;

    // bar widths are inline styles of the child div. B should be much wider than A
    const widthA = barA.style.width;
    const widthB = barB.style.width;

    expect(widthA).toBeDefined();
    expect(widthB).toBeDefined();
    // B should be 100% (since it's the max) and A should be a small percentage
    expect(widthB).toBe('100%');
    expect(widthA).not.toBe('100%');
  });
});
