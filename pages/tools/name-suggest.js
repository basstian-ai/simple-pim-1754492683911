import React, { useState } from 'react';

const NameSuggestTool = () => {
  const [keywords, setKeywords] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const res = await fetch('/api/ai/name-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: keywords, count })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to generate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(suggestions.join('\n'));
      alert('Copied to clipboard');
    } catch (_) {}
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>AI Product Name Suggestor</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Generate catchy product names from keywords.</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          aria-label="Keywords"
          placeholder="Enter keywords (e.g., eco bamboo toothbrush)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          aria-label="Count"
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          style={{ width: 90, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <button type="submit" disabled={loading || !keywords.trim()} style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #0b64d8', background: '#0b64d8', color: 'white', cursor: 'pointer' }}>
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </form>

      {error && <div role="alert" style={{ color: '#b00020', marginBottom: '0.75rem' }}>{error}</div>}

      {suggestions.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <strong>{suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'}</strong>
            <button type="button" onClick={copyAll} style={{ marginLeft: 'auto', padding: '0.25rem 0.5rem', borderRadius: 6, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer', fontSize: 12 }}>Copy all</button>
          </div>
          <ol style={{ paddingLeft: '1.25rem' }}>
            {suggestions.map((s, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default NameSuggestTool;
