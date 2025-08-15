import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecentFailureFeed from '../RecentFailureFeed';

describe('RecentFailureFeed deep links', () => {
  it('builds a job detail link with errorId and preserves feed filters via back param', () => {
    const failures = [
      {
        jobId: 'job-123',
        runId: 'run-7',
        errorId: 'err-42',
        title: 'Export failed: schema mismatch',
        occurredAt: '2025-08-15T10:00:00Z',
      },
    ];

    const feedFilters = { severity: 'critical', assignedTo: 'me' };

    render(
      <MemoryRouter initialEntries={["/feed"]}>
        <RecentFailureFeed failures={failures} feedFilters={feedFilters} />
      </MemoryRouter>
    );

    const link = screen.getByTestId('failure-link-job-123-run-7');
    expect(link).toBeInTheDocument();

    // Link href is expected to include job/run, errorId and back param with encoded filters
    const href = link.getAttribute('href') || '';
    expect(href).toContain('/jobs/job-123/runs/run-7');
    expect(href).toContain('errorId=err-42');
    // back param contains filters JSON encoded
    expect(href).toMatch(/back=\/feed\?filters=%7B.*%22assignedTo%22.*%7D/);
  });
});
