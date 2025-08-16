import {
  getQueryTimeoutMs,
  DEFAULT_QUERY_TIMEOUT_MS,
  MIN_QUERY_TIMEOUT_MS,
  MAX_QUERY_TIMEOUT_MS,
} from '../src/config/queryTimeout';

describe('getQueryTimeoutMs', () => {
  const envKey = 'QUERY_TIMEOUT_MS';

  beforeEach(() => {
    delete process.env[envKey];
  });

  it('returns default when env var is not set', () => {
    expect(getQueryTimeoutMs()).toBe(DEFAULT_QUERY_TIMEOUT_MS);
  });

  it('parses a valid numeric value', () => {
    process.env[envKey] = '60000';
    expect(getQueryTimeoutMs()).toBe(60000);
  });

  it('applies minimum bound when set value is too small', () => {
    process.env[envKey] = '1';
    expect(getQueryTimeoutMs()).toBe(MIN_QUERY_TIMEOUT_MS);
  });

  it('applies maximum bound when set value is too large', () => {
    process.env[envKey] = String(MAX_QUERY_TIMEOUT_MS * 10);
    expect(getQueryTimeoutMs()).toBe(MAX_QUERY_TIMEOUT_MS);
  });

  it('falls back to default for invalid values', () => {
    process.env[envKey] = 'not-a-number';
    expect(getQueryTimeoutMs()).toBe(DEFAULT_QUERY_TIMEOUT_MS);
  });

  it('accepts integer-like floats by flooring to ms integer', () => {
    process.env[envKey] = '1500.9';
    expect(getQueryTimeoutMs()).toBe(1500);
  });
});
