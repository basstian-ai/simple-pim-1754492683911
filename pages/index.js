import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Optionally load a few popular / trending recipes on mount
    // We'll call the API with an empty query which returns a small set
    fetchMeals('')
  }, [])

  async function fetchMeals(q) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
      )
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      setMeals(data.meals || [])
    } catch (err) {
      console.error(err)
      setError('Unable to fetch recipes. Please try again.')
      setMeals([])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    fetchMeals(query.trim())
  }

  function saveFavorite(meal) {
    try {
      const raw = localStorage.getItem('favorites')
      const favs = raw ? JSON.parse(raw) : []
      if (!favs.find((m) => m.idMeal === meal.idMeal)) {
        favs.push(meal)
        localStorage.setItem('favorites', JSON.stringify(favs))
        alert(`${meal.strMeal} saved to favorites`)
      } else {
        alert(`${meal.strMeal} is already in favorites`)
      }
    } catch (err) {
      console.error('Failed to save favorite', err)
      alert('Could not save favorite')
    }
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Recipe Finder</h1>
        <nav style={styles.nav}>
          <Link href="/favorites">Favorites</Link>
          <span style={{ margin: '0 8px' }}>·</span>
          <Link href="/about">About</Link>
        </nav>
      </header>

      <section style={styles.searchSection}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="q" style={{ display: 'none' }}>
            Search recipes
          </label>
          <input
            id="q"
            placeholder="Search recipes (e.g. chicken, beef, pasta)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </section>

      <section style={styles.results}>
        {meals.length === 0 && !loading ? (
          <p style={{ color: '#666' }}>No recipes found. Try a different search.</p>
        ) : (
          <ul style={styles.list}>
            {meals.map((meal) => (
              <li key={meal.idMeal} style={styles.card}>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  style={styles.thumb}
                />
                <div style={styles.cardBody}>
                  <h3 style={styles.mealTitle}>{meal.strMeal}</h3>
                  <p style={styles.meta}>
                    {meal.strCategory || '—'} • {meal.strArea || '—'}
                  </p>
                  <div style={styles.actions}>
                    <Link href={`/recipe/${meal.idMeal}`}>
                      <a style={styles.link}>View details</a>
                    </Link>
                    <button
                      onClick={() => saveFavorite(meal)}
                      style={styles.saveButton}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer style={styles.footer}>
        <small>Data from TheMealDB • Example project</small>
      </footer>
    </main>
  )
}

const styles = {
  container: {
    maxWidth: 900,
    margin: '24px auto',
    padding: '0 16px',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { margin: 0, fontSize: 28 },
  nav: { fontSize: 14, color: '#0366d6' },
  searchSection: {
    marginBottom: 20,
  },
  form: { display: 'flex', gap: 8, alignItems: 'center' },
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
    background: '#0b6cff',
    color: 'white',
    cursor: 'pointer',
  },
  error: { color: 'crimson' },
  results: { marginTop: 8 },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 },
  card: {
    display: 'flex',
    gap: 12,
    padding: 12,
    border: '1px solid #eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  thumb: { width: 96, height: 96, objectFit: 'cover', borderRadius: 6 },
  cardBody: { flex: 1 },
  mealTitle: { margin: '0 0 6px 0', fontSize: 18 },
  meta: { margin: 0, color: '#666', fontSize: 13 },
  actions: { marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' },
  link: { color: '#0b6cff', textDecoration: 'none' },
  saveButton: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
  },
  footer: { marginTop: 28, color: '#888', textAlign: 'center' },
}
