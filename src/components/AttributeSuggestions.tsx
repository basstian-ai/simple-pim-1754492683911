import React, { useState } from 'react';

type Suggestion = {
  group: string;
  attribute: string;
  value: string;
  score: number;
  reason?: string;
};

export default function AttributeSuggestions(props: {
  productText: string;
  previewMode?: boolean;
  telemetryOptIn?: boolean;
}) {
  const { productText, previewMode = false, telemetryOptIn = false } = props;
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchSuggestions() {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productText, preview: previewMode, telemetryOptIn })
      });
      if (!resp.ok) throw new Error(`status ${resp.status}`);
      const json = await resp.json();
      setSuggestions(json.suggestions || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 6 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <strong>AI attribute suggestions</strong>
        {previewMode && <span style={{ fontSize: 12, color: '#666' }}>(preview)</span>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <button onClick={fetchSuggestions} disabled={loading}>
          {loading ? 'Working…' : 'Get suggestions'}
        </button>
        <small style={{ marginLeft: 8, color: '#666' }}>
          {telemetryOptIn ? 'Telem. enabled' : 'Telem. disabled'}
        </small>
      </div>

      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}

      {suggestions && (
        <div>
          <ul>
            {suggestions.map((s, i) => (
              <li key={`${s.attribute}-${i}`}>
                <strong>{s.attribute}</strong>: {s.value}
                <span style={{ color: '#666', marginLeft: 8 }}>({Math.round(s.score * 100)}%)</span>
                {s.reason && <div style={{ fontSize: 12, color: '#666' }}>{s.reason}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!suggestions && <div style={{ fontSize: 12, color: '#666' }}>No suggestions yet.</div>}
    </div>
  );
}
