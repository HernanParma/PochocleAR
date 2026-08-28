import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getFilterCatalogs } from '../../application/movies/getFilterCatalogs.js';
import { queryCatalog } from '../../application/movies/queryCatalog.js';
import { MediaGrid } from '../components/MediaGrid/MediaGrid.jsx';
import { Pagination } from '../components/Pagination/Pagination.jsx';
import styles from './SearchView.module.css';

function readParams(searchParams) {
  return {
    q: searchParams.get('q') || '',
    type: searchParams.get('type') === 'tv' ? 'tv' : 'movie',
    provider: searchParams.get('provider') || '',
    genre: searchParams.get('genre') || '',
    page: Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1,
  };
}

export function SearchView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => readParams(searchParams), [searchParams]);

  const [queryInput, setQueryInput] = useState(params.q);
  const [genres, setGenres] = useState([]);
  const [providers, setProviders] = useState([]);
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState('idle');
  const [providerApplied, setProviderApplied] = useState(true);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    setQueryInput(params.q);
  }, [params.q]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalogs() {
      setCatalogError('');
      try {
        const data = await getFilterCatalogs(params.type);
        if (cancelled) return;
        setGenres(data.genres);
        setProviders(data.providers);
      } catch (error) {
        if (cancelled) return;
        setGenres([]);
        setProviders([]);
        setCatalogError(
          error?.message || 'No se pudieron cargar géneros y plataformas.',
        );
      }
    }

    loadCatalogs();
    return () => {
      cancelled = true;
    };
  }, [params.type]);

  useEffect(() => {
    const hasQuery = Boolean(params.q.trim());
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const data = await queryCatalog({
          query: params.q,
          mediaType: params.type,
          providerId: params.provider,
          genreId: params.genre,
          page: params.page,
        });

        if (cancelled) return;
        setResults(data.results);
        setTotalPages(data.totalPages || 0);
        setMode(data.mode);
        setProviderApplied(data.providerApplied);
        setStatus(data.results.length ? 'ready' : 'empty');
      } catch (error) {
        if (cancelled) return;
        setResults([]);
        setTotalPages(0);
        setStatus('error');
        setErrorMessage(error?.message || 'No se pudo realizar la búsqueda.');
      }
    }, hasQuery ? 400 : 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [params.q, params.type, params.provider, params.genre, params.page]);

  function updateParams(patch, { resetPage = true } = {}) {
    const next = {
      q: params.q,
      type: params.type,
      provider: params.provider,
      genre: params.genre,
      page: String(params.page),
      ...patch,
    };

    if (resetPage && patch.page === undefined) {
      next.page = '1';
    }

    const sp = new URLSearchParams();
    if (next.q?.trim()) sp.set('q', next.q.trim());
    if (next.type && next.type !== 'movie') sp.set('type', next.type);
    if (next.provider) sp.set('provider', String(next.provider));
    if (next.genre) sp.set('genre', String(next.genre));
    if (next.page && Number(next.page) > 1) sp.set('page', String(next.page));
    setSearchParams(sp);
  }

  function handleLiveChange(event) {
    const value = event.target.value;
    setQueryInput(value);
    updateParams({ q: value });
  }

  return (
    <div className={styles.searchPage}>
      <section className={styles.intro} aria-labelledby="search-title">
        <h1 id="search-title" className={styles.title}>
          Búsqueda
        </h1>
        <p className={styles.lead}>
          Live search por título y filtrado avanzado simultáneo: tipo de
          contenido, plataforma de streaming en Argentina y género.
        </p>
      </section>

      <section className={styles.panel} aria-labelledby="filters-title">
        <h2 id="filters-title" className={styles.panel__title}>
          Buscar y filtrar
        </h2>

        <div className={styles.liveSearch}>
          <label htmlFor="search-query">Live search</label>
          <div className={styles.liveSearch__row}>
            <input
              id="search-query"
              className={styles.input}
              type="search"
              name="q"
              value={queryInput}
              onChange={handleLiveChange}
              placeholder="Escribí un título…"
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="filter-type">Tipo de contenido</label>
            <select
              id="filter-type"
              className={styles.select}
              value={params.type}
              onChange={(event) =>
                updateParams({
                  type: event.target.value,
                  genre: '',
                  provider: '',
                })
              }
            >
              <option value="movie">Películas</option>
              <option value="tv">Series</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="filter-provider">Plataforma (AR)</label>
            <select
              id="filter-provider"
              className={styles.select}
              value={params.provider}
              onChange={(event) => updateParams({ provider: event.target.value })}
            >
              <option value="">Todas</option>
              {providers.map((provider) => (
                <option key={provider.providerId} value={provider.providerId}>
                  {provider.providerName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="filter-genre">Género / categoría</label>
            <select
              id="filter-genre"
              className={styles.select}
              value={params.genre}
              onChange={(event) => updateParams({ genre: event.target.value })}
            >
              <option value="">Todos</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {catalogError && (
          <p className={`${styles.status} ${styles['status--error']}`} role="alert">
            {catalogError}
          </p>
        )}

        {mode === 'search' && params.provider && !providerApplied && (
          <p className={styles.hint}>
            Con texto de búsqueda activo, el filtro de plataforma se aplica al
            limpiar el título (modo descubrimiento por plataforma).
          </p>
        )}
      </section>

      <section aria-labelledby="results-title">
        <h2 id="results-title" className={styles.resultsTitle}>
          Resultados
        </h2>

        {status === 'loading' && (
          <p className={styles.status} role="status">
            Cargando resultados…
          </p>
        )}

        {status === 'error' && (
          <p className={`${styles.status} ${styles['status--error']}`} role="alert">
            {errorMessage}
          </p>
        )}

        {status === 'empty' && (
          <p className={styles.status} role="status">
            No hay resultados con estos criterios.{' '}
            <Link to="/">Volver al inicio</Link>
          </p>
        )}

        {status === 'ready' && (
          <>
            <MediaGrid items={results} labelledBy="results-title" />
            <Pagination
              page={params.page}
              totalPages={totalPages}
              disabled={status === 'loading'}
              onChange={(page) => updateParams({ page: String(page) }, { resetPage: false })}
            />
          </>
        )}

        {status === 'idle' && (
          <p className={styles.status}>
            Usá el live search o los filtros para explorar el catálogo.
          </p>
        )}
      </section>
    </div>
  );
}
