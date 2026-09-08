import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedContent } from '../../application/movies/getFeaturedContent.js';
import { MediaGrid } from '../components/MediaGrid/MediaGrid.jsx';
import styles from './HomeView.module.css';

export function HomeView() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      setStatus('loading');
      setErrorMessage('');

      try {
        const data = await getFeaturedContent({ limit: 8 });
        if (cancelled) return;
        setFeatured(data.results);
        setStatus(data.results.length ? 'ready' : 'empty');
      } catch (error) {
        if (cancelled) return;
        setFeatured([]);
        setStatus('error');
        setErrorMessage(
          error?.message ||
            'No se pudieron cargar los destacados. Intentá de nuevo más tarde.',
        );
      }
    }

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set('q', trimmed);
    }
    const suffix = params.toString();
    navigate(suffix ? `/buscar?${suffix}` : '/buscar');
  }

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-brand">
        <h1 id="home-brand" className={styles.hero__brand}>
          Pochocle<span>AR</span>
        </h1>
        <p className={styles.hero__tagline}>
          Encontrá películas y series en streaming disponibles en Argentina.
        </p>

        <form className={styles.search} onSubmit={handleSearchSubmit} role="search">
          <label className="sr-only" htmlFor="home-search">
            Buscar películas o series
          </label>
          <div className={styles.search__row}>
            <input
              id="home-search"
              className={styles.search__input}
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscá por título…"
              autoComplete="off"
            />
            <button type="submit" className={styles.search__button}>
              Buscar
            </button>
          </div>
        </form>
      </section>

      <section className={styles.featured} aria-labelledby="featured-title">
        <header className={styles.featured__header}>
          <h2 id="featured-title" className={styles.featured__title}>
            Tendencias de hoy
          </h2>
        </header>

        {status === 'loading' && (
          <p className={styles.status} role="status">
            Cargando destacados desde TMDB…
          </p>
        )}

        {status === 'error' && (
          <p className={`${styles.status} ${styles['status--error']}`} role="alert">
            <strong>Error:</strong> {errorMessage}
          </p>
        )}

        {status === 'empty' && (
          <p className={styles.status} role="status">
            No hay destacados para mostrar en este momento.
          </p>
        )}

        {status === 'ready' && (
          <MediaGrid items={featured} labelledBy="featured-title" />
        )}
      </section>
    </div>
  );
}
