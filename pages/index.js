import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    setMeals(null)

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`
      )
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`)
      const data = await res.json()
      setMeals(data.meals)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <Head>
        <title>Recipe Finder</title>
        <meta name="description" content="Search recipes from TheMealDB" />
      </Head>

      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Recipe Finder</h1>
        <nav>
          <Link href="/about">
            <a style={styles.navLink}>About</a>
          </Link>
          <Link href="/favorites">
            <a style={styles.navLink}>Favorites</a>
          </Link>
        </nav>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSearch} style={styles.form}>
          <input
            aria-label="Search recipes"
            placeholder="Search recipes (e.g. chicken, pasta)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && <p style={styles.error}>Error: {error}</p>}

        {meals === null && !loading && (
          <p style={styles.hint}>Try searching for a recipe to get started.</p>
        )}

        {meals && meals.length === 0 && (
          <p style={styles.hint}>No recipes found for "{query}".</p>
        )}

        {meals && meals.length > 0 && (
          <section style={styles.grid}>
            {meals.map((meal) => (
              <article key={meal.idMeal} style={styles.card}>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  style={styles.thumb}
                />
                <div style={styles.cardBody}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{meal.strMeal}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                    {meal.strCategory || '—'} • {meal.strArea || '—'}
                  </p>
                  <div style={{ marginTop: 10 }}>
                    <Link href={`/recipe/${meal.idMeal}`}>
                      <a style={styles.detailsLink}>View details</a>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer style={styles.footer}>Built with TheMealDB • Minimal Recipe Finder</footer>
    </div>
  )
}

const styles = {
  container: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #eee'
  },
  navLink: {
    marginLeft: 12,
    color: '#0070f3',
    textDecoration: 'none'
  },
  main: {
    padding: '24px'
  },
  form: {
    display: 'flex',
    gap: 8,
    marginBottom: 20
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6
  },
  button: {
    padding: '10px 14px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  error: {
    color: '#b00020'
  },
  hint: {
    color: '#666'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16
  },
  card: {
    border: '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  thumb: {
    width: '100%',
    height: 140,
    objectFit: 'cover'
  },
  cardBody: {
    padding: 12,
    flex: 1
  },
  detailsLink: {
    display: 'inline-block',
    padding: '6px 10px',
    background: '#fafafa',
    border: '1px solid #eee',
    borderRadius: 6,
    color: '#333',
    textDecoration: 'none',
    fontSize: 13
  },
  footer: {
    marginTop: 'auto',
    padding: '16px 24px',
    borderTop: '1px solid #eee',
    fontSize: 13,
    color: '#666'
  }
}
