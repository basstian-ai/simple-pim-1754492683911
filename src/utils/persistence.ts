export type TimeWindow = '24h' | '7d' | '30d';

export type RecentFailureFeedSavedFilters = {
  channels?: string[];
  envs?: string[];
  timeWindow?: TimeWindow;
};

const PREFIX = 'pim:';

export function loadFilters(key = 'recentFailureFeed'): RecentFailureFeedSavedFilters | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as RecentFailureFeedSavedFilters;
  } catch (e) {
    // swallow JSON errors; treat as no saved state
    return null;
  }
}

export function saveFilters(key = 'recentFailureFeed', value: RecentFailureFeedSavedFilters) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // ignore quota/permission issues
  }
}
