import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecentFailureFeed from '../components/RecentFailureFeed';

describe('RecentFailureFeed - preserve state', () => {
  beforeEach(() => {
    // clear history.state for isolation
    try {
      window.history.replaceState({}, '');
    } catch (e) {
      // ignore
    }
  });

  test('saves filters and scrollTop to history.state when drilling into job', () => {
    const items = Array.from({ length: 20 }).map((_, i) => ({ id: String(i + 1), title: `job-${i + 1}` }));
    const navigateMock = jest.fn();

    render(<RecentFailureFeed items={items} initialFilters={{ search: 'initial' }} onNavigate={navigateMock} />);

    const container = screen.getByTestId('feed-container');
    // simulate user scroll
    // jsdom does not implement layout; set property directly
    Object.defineProperty(container, 'scrollTop', { value: 123, writable: true });

    // change search box to new value
    const search = screen.getByLabelText('feed-search') as HTMLInputElement;
    fireEvent.change(search, { target: { value: 'filter-me' } });

    // click a job
    const job = screen.getByTestId('job-3');
    fireEvent.click(job);

    expect(navigateMock).toHaveBeenCalledWith('3');

    const pathname = window.location.pathname;
    const key = `${pathname}::recentFailureFeed:v1`;
    const hs = window.history.state || {};
    expect(hs[key]).toBeDefined();
    expect(hs[key].filters).toBeDefined();
    expect(hs[key].filters.search).toBe('filter-me');
    // scrollTop saved (note: our test manually set container.scrollTop, ensure it's present)
    expect(typeof hs[key].scrollTop).toBe('number');
  });

  test('restores scrollTop and filters from history.state on mount', () => {
    const items = Array.from({ length: 5 }).map((_, i) => ({ id: String(i + 1), title: `job-${i + 1}` }));
    const pathname = window.location.pathname;
    const key = `${pathname}::recentFailureFeed:v1`;
    const saved = { filters: { search: 'restored' }, scrollTop: 99 };
    // pre-seed history.state
    try {
      const hs = Object.assign({}, window.history.state || {}, { [key]: saved });
      window.history.replaceState(hs, document.title);
    } catch (e) {
      // noop
    }

    render(<RecentFailureFeed items={items} initialFilters={{}} />);

    // search input should be restored
    const search = screen.getByLabelText('feed-search') as HTMLInputElement;
    expect(search.value).toBe('restored');

    // container scrollTop should be restored — jsdom doesn't layout, but our component sets scrollTop property
    const container = screen.getByTestId('feed-container');
    // requestAnimationFrame callback in component will set scrollTop; flush by running timers if necessary
    // but since we used requestAnimationFrame, it's synchronous in many test environments; check the property
    expect(container.scrollTop).toBe(99);
  });
});
