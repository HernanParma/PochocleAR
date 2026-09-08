import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listHistory } from '../../application/history/historyService.js';
import { buildImageUrl } from '../../infrastructure/config/tmdbConfig.js';
import styles from './HistoryView.module.css';

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function HistoryView() {
  const [items, setItems] = useState(() => listHistory());

  useEffect(() => {
    setItems(listHistory());
  }, []);

  return (
    <section className={styles.page} aria-labelledby="history-title">
      <div className={styles.intro}>
        <h1 id="history-title" className={styles.title}>
          Historial de visitas
        </h1>
        <p className={styles.lead}>
          Las últimas películas y series que estuviste viendo.
        </p>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Aún no hay visitas registradas. Abrí un título desde el{' '}
          <Link to="/">inicio</Link> o la <Link to="/buscar">búsqueda</Link>.
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => {
            const poster = buildImageUrl(item.posterPath, 'w185');
            return (
              <li key={`${item.id}-${item.visitedAt}`}>
                <Link
                  to={`/${item.mediaType}/${item.tmdbId}`}
                  className={styles.item}
                >
                  <div className={styles.thumb}>
                    {poster ? (
                      <img src={poster} alt="" loading="lazy" />
                    ) : (
                      <div className={styles.thumbPlaceholder}>Sin póster</div>
                    )}
                  </div>
                  <div className={styles.body}>
                    <h2 className={styles.itemTitle}>{item.title}</h2>
                    <p className={styles.meta}>
                      {item.mediaType === 'tv' ? 'Serie' : 'Película'} ·{' '}
                      {formatDate(item.visitedAt)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
