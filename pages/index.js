import React, { useEffect, useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch a default set of "trending" meals on first load
  useEffect(() => {
    fetchTrending();
  }, []);

  async function fetchTrending() {
    setLoading(true);
    setError(null);
    try {
      // TheMealDB: using a common search term to present a set of meals on first load
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken');
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      setError('Failed to load trending recipes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) {
      fetchTrending();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Recipe Finder</h1>
        <p style={styles.subtitle}>Search recipes from TheMealDB</p>
        <form onSubmit={handleSearch} style={styles.form}>
          <input
            aria-label="Search recipes"
            placeholder="Search recipes (e.g. chicken, beef, pasta)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Search
          </button>
        </form>
      </header>

      <main style={styles.main}>
        {loading && <p>Loading recipes…</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {!loading && meals.length === 0 && (
          <p>No recipes found. Try a different search term.</p>
        )}

        <ul style={styles.grid}>
          {meals.map((meal) => (
            <li key={meal.idMeal} style={styles.card}>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={styles.thumb}
              />
              <div style={styles.cardBody}>
                <h3 style={styles.mealTitle}>{meal.strMeal}</h3>
                <p style={styles.meta}>{meal.strCategory || ''} • {meal.strArea || ''}</p>
                <p style={styles.excerpt}>{(meal.strInstructions || '').slice(0, 140)}{(meal.strInstructions || '').length > 140 ? '…' : ''}</p>
                {/* In a full app this would link to a recipe detail page at /recipes/[id] */}
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer style={styles.footer}>
        <small>Data from TheMealDB • No authentication required</small>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
    padding: '24px',
    maxWidth: 980,
    margin: '0 auto',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: 28,
  },
  subtitle: {
    margin: '6px 0 12px 0',
    color: '#555',
  },
  form: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    fontSize: 14,
  },
  button: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#111827',
    color: 'white',
    cursor: 'pointer',
  },
  main: {
    marginTop: 18,
  },
  grid: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  card: {
    border: '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  thumb: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
  },
  cardBody: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  mealTitle: {
    margin: 0,
    fontSize: 16,
  },
  meta: {
    margin: 0,
    color: '#666',
    fontSize: 12,
  },
  excerpt: {
    margin: 0,
    color: '#333',
    fontSize: 13,
    flex: 1,
  },
  footer: {
    marginTop: 28,
    textAlign: 'center',
    color: '#777',
  },
};
