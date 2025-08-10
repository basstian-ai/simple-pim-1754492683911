import { useState } from 'react';

export default function AttributeSuggestTool() {
  const [text, setText] = useState('Red cotton t-shirt, size M, made in Portugal. Weight: 180 g. Dimensions: 30 x 20 x 2 cm. Brand: Acme. Unisex.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  async function runSuggest(e) {
    e && e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('/api/ai/attribute-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Request failed');
      }
      const data = await res.json();
      setResults(data.suggestions || []);
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
      const k = item[key] || 'Other';
      (acc[k] = acc[k] || []).push(item);
      return acc;
    }, {});
  }

  const grouped = groupBy(results, 'group');

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1>AI-ish Attribute Suggestion</h1>
      <p style={{ color: '#555' }}>Paste a product title/description to extract structured attributes like Color, Size, Material, Country of Origin, and more. This runs locally without external APIs.</p>

      <form onSubmit={runSuggest}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{ width: '100%', fontSize: 14, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
          placeholder="Enter product description..."
        />
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <button type="submit" onClick={runSuggest} disabled={loading} style={{ padding: '8px 14px', background: '#111827', color: 'white', border: 0, borderRadius: 6, cursor: 'pointer' }}>
            {loading ? 'Suggesting…' : 'Suggest Attributes'}
          </button>
          <button type="button" onClick={() => setText('')} style={{ padding: '8px 14px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer' }}>Clear</button>
        </div>
      </form>

      {error ? <p style={{ color: '#b91c1c', marginTop: 12 }}>{error}</p> : null}

      <div style={{ marginTop: 20 }}>
        {Object.keys(grouped).length === 0 && !loading ? (
          <p style={{ color: '#6b7280' }}>No suggestions yet.</p>
        ) : (
          Object.keys(grouped).sort().map((g) => (
            <div key={g} style={{ marginBottom: 16 }}>
              <h3 style={{ margin: '8px 0' }}>{g}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {grouped[g].map((s, idx) => (
                  <span key={idx} title={`confidence: ${Math.round(s.confidence * 100)}%`}
                    style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 999, background: '#f3f4f6', border: '1px solid #e5e7eb', fontSize: 13 }}>
                    {s.name}: {s.value}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <hr style={{ margin: '24px 0' }} />
      <p style={{ color: '#6b7280', fontSize: 12 }}>Tip: You can also call the API directly: GET/POST /api/ai/attribute-suggest with {`{ text }`} in body/query.</p>
    </div>
  );
}
