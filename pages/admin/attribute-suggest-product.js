import React, { useState } from 'react';

const AttributeSuggestProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuggestions([]);
    setLoading(true);
    try {
      const body = {
        name,
        description,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch('/api/attributes/suggest-for-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (Array.isArray(data)) setSuggestions(data);
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Suggest Attributes for a Product</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Paste a product name/description and optional tags to get attribute suggestions.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Product name"
          aria-label="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <textarea
          placeholder="Product description"
          aria-label="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          aria-label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: 6 }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #0b64d8',
              background: '#0b64d8',
              color: 'white',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Suggesting…' : 'Suggest Attributes'}
          </button>
          {suggestions.length > 0 && (
            <span style={{ color: '#555', fontSize: 12 }}>
              {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </form>

      {error && (
        <div role="alert" style={{ color: '#b00020', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, marginBottom: '0.5rem' }}>Suggested Attributes</h2>
          <ul>
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttributeSuggestProduct;
