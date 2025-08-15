import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the API module
jest.mock('../../api/publishJobs', () => ({
  fetchRecentFailedJobs: jest.fn()
}))

import {fetchRecentFailedJobs} from '../../api/publishJobs'
import {RecentFailureFeed} from './RecentFailureFeed'

const mockedFetch = fetchRecentFailedJobs as jest.MockedFunction<typeof fetchRecentFailedJobs>

describe('RecentFailureFeed', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders a list of failures and links', async () => {
    const now = new Date().toISOString()
    mockedFetch.mockResolvedValueOnce([
      {
        id: 'job-1',
        jobType: 'export-to-channel',
        status: 'failed',
        errorCode: 'VALIDATION_MISSING_FIELD',
        errorMessage: 'Missing required field: price',
        timestamp: now,
        logUrl: 'https://logs.example.com/job-1'
      },
      {
        id: 'job-2',
        jobType: 'transform',
        status: 'failed',
        errorCode: 'NETWORK_TIMEOUT',
        errorMessage: 'Upstream timeout',
        timestamp: now
      }
    ])

    render(<RecentFailureFeed limit={10} />)

    // loading state should appear
    expect(screen.getByRole('status')).toHaveTextContent(/Loading recent failures/)

    // wait for items to render
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled())

    expect(screen.getByText('Missing required field: price')).toBeInTheDocument()
    expect(screen.getByText('Upstream timeout')).toBeInTheDocument()

    // taxonomy badges
    expect(screen.getAllByText('Validation').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Network').length).toBeGreaterThanOrEqual(1)

    // links
    expect(screen.getByRole('link', {name: /View job job-1/i}) || screen.getByText('View details')).toBeTruthy()
    expect(screen.getByText('Logs')).toBeInTheDocument()
  })

  it('shows empty state when no failures', async () => {
    mockedFetch.mockResolvedValueOnce([])
    render(<RecentFailureFeed />)
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled())
    expect(screen.getByText('No recent failures.')).toBeInTheDocument()
  })

  it('displays error when fetch fails', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network error'))
    render(<RecentFailureFeed />)
    await waitFor(() => expect(mockedFetch).toHaveBeenCalled())
    expect(screen.getByRole('alert')).toHaveTextContent(/Error loading failures: network error/)
  })
})
