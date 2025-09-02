import React, { useEffect, useState } from 'react';

// Basic home page for Recipe Finder
// - simple search against TheMealDB
// - shows results with image and title
// - allows adding/removing favorites stored in localStorage

export default function Home() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('rf:favorites');
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {
      // ignore parse errors
      console.error('Failed to load favorites', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('rf:favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  function isFavorite(meal) {
    return favorites.some((m) => m.idMeal === meal.idMeal);
  }

  function toggleFavorite(meal) {
    setFavorites((prev) => {
      if (prev.some((m) => m.idMeal === meal.idMeal)) {
        return prev.filter((m) => m.idMeal !== meal.idMeal);
      }
      // keep a small meal object in storage
      const tiny = { idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb };
      return [tiny, ...prev];
    });
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setMeals([]);

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Recipe Finder</h1>
        <p style={{ margin: '6px 0 0 0', color: '#555' }}>Search recipes from TheMealDB</p>
      </header>

      <form onSubmit={handleSearch} style={styles.form} aria-label="search-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe (e.g. chicken, pasta)"
          aria-label="search"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <div role="alert" style={styles.error}>
          {error}
        </div>
      )}

      <section style={styles.container}>
        {meals.length === 0 && !loading ? (
          <div style={styles.empty}>Try searching for a meal to see results.</div>
        ) : (
          meals.map((meal) => (
            <article key={meal.idMeal} style={styles.card}>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={styles.thumb}
              />
              <div style={styles.cardBody}>
                <h3 style={{ margin: '0 0 8px 0' }}>{meal.strMeal}</h3>
                <div style={styles.cardActions}>
                  <a
                    href={`/recipes/${meal.idMeal}`}
                    style={styles.link}
                    onClick={(e) => {
                      // allow navigation but avoid full JS for now; graceful fallback
                    }}
                  >
                    View
                  </a>
                  <button
                    onClick={() => toggleFavorite(meal)}
                    aria-pressed={isFavorite(meal)}
                    style={isFavorite(meal) ? styles.favButtonActive : styles.favButton}
                  >
                    {isFavorite(meal) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <aside style={styles.sidebar}>
        <h4 style={{ marginTop: 0 }}>Favorites</h4>
        {favorites.length === 0 ? (
          <div style={styles.emptySmall}>No favorites yet. Save recipes to see them here.</div>
        ) : (
          <ul style={styles.favList}>
            {favorites.map((f) => (
              <li key={f.idMeal} style={styles.favItem}>
                <img src={f.strMealThumb} alt="" style={styles.favThumb} />
                <span>{f.strMeal}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 980,
    margin: '32px auto',
    padding: '0 20px',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  header: {
    marginBottom: 18,
  },
  form: {
    display: 'flex',
    gap: 8,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid #ddd',
    fontSize: 16,
  },
  button: {
    padding: '10px 14px',
    borderRadius: 6,
    border: 'none',
    background: '#0070f3',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    border: '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  thumb: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    display: 'block',
  },
  cardBody: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    marginTop: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
    alignSelf: 'center',
  },
  favButton: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
  },
  favButtonActive: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #0070f3',
    background: '#e6f0ff',
    color: '#0070f3',
    cursor: 'pointer',
  },
  sidebar: {
    marginTop: 24,
    borderTop: '1px solid #f0f0f0',
    paddingTop: 16,
  },
  favList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  favItem: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    padding: 6,
    border: '1px solid #f0f0f0',
    borderRadius: 6,
    background: 'white',
  },
  favThumb: {
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: 4,
  },
  empty: {
    color: '#666',
    padding: 18,
    gridColumn: '1 / -1',
  },
  emptySmall: {
    color: '#666',
  },
  error: {
    color: '#b00020',
    marginBottom: 12,
  },
};
