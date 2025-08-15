import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RecentFailureFeed from '../RecentFailureFeed';

const key = 'recentFailureFeed';

describe('RecentFailureFeed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('persists selections to localStorage and restores them on mount', () => {
    const availableChannels = ['web', 'mobile', 'marketplace'];
    const availableEnvs = ['prod', 'staging'];

    const { getByTestId, unmount } = render(
      <RecentFailureFeed availableChannels={availableChannels} availableEnvs={availableEnvs} persistenceKey={key} />
    );

    // select channel 'web'
    const chWeb = getByTestId('channel-web') as HTMLInputElement;
    fireEvent.click(chWeb);
    expect(chWeb.checked).toBe(true);

    // select env 'staging'
    const envStaging = getByTestId('env-staging') as HTMLInputElement;
    fireEvent.click(envStaging);
    expect(envStaging.checked).toBe(true);

    // select time window 7d
    const tw7d = getByTestId('tw-7d');
    fireEvent.click(tw7d);

    // Ensure localStorage saved values (prefix 'pim:')
    const raw = localStorage.getItem('pim:' + key);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.channels).toEqual(['web']);
    expect(parsed.envs).toEqual(['staging']);
    expect(parsed.timeWindow).toBe('7d');

    // Unmount and remount to verify restore
    unmount();

    render(<RecentFailureFeed availableChannels={availableChannels} availableEnvs={availableEnvs} persistenceKey={key} />);

    // the checkboxes should reflect persisted state
    expect(screen.getByTestId('channel-web')).toBeChecked();
    expect(screen.getByTestId('env-staging')).toBeChecked();
    // summary should mention 1 channel, 1 env, last 7d
    expect(screen.getByTestId('summary')).toHaveTextContent('Selected: 1 channel(s), 1 env(s), last 7d');
  });

  it('apply callback is invoked with current filters', () => {
    const availableChannels = ['web'];
    const availableEnvs = ['prod'];
    const onApply = jest.fn();

    const { getByTestId } = render(
      <RecentFailureFeed availableChannels={availableChannels} availableEnvs={availableEnvs} onApply={onApply} />
    );

    fireEvent.click(getByTestId('channel-web'));
    fireEvent.click(getByTestId('env-prod'));
    fireEvent.click(getByTestId('tw-30d'));

    fireEvent.click(getByTestId('apply'));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({ channels: ['web'], envs: ['prod'], timeWindow: '30d' });
  });
});
