import { useState } from 'react';

export default function AttributeSuggestPage() {
  const [text, setText] = useState('Acme Cotton T-Shirt, size M, color Black. Made of 100% cotton. Brand: Acme. Dimensions: 10 x 20 x 5 cm. SKU: SHIRT-001');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/attributes/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 16px' }}>
      <h1>Attribute Suggestions (Beta)</h1>
      <p>Paste a product title or description. This tool suggests structured attributes like color, size, material, brand, and basic dimensions.</p>
      <form onSubmit={onSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: '100%', fontFamily: 'inherit' }}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Suggesting…' : 'Suggest Attributes'}
          </button>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Suggestions ({result.count})</h2>
          {result.attributes.length === 0 && <p>No attributes found.</p>}
          {result.attributes.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Code</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Name</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Value</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px' }}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {result.attributes.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{a.code}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{a.name}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{String(a.value)}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px' }}>{Math.round((a.confidence || 0) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
