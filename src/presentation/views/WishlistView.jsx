import { Link } from 'react-router-dom';
import { buildImageUrl } from '../../infrastructure/config/tmdbConfig.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import styles from './WishlistView.module.css';

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

export function WishlistView() {
  const { items, removeItem } = useWishlist();

  return (
    <section className={styles.page} aria-labelledby="wishlist-title">
      <h1 id="wishlist-title" className={styles.title}>
        Lista de deseos
      </h1>
      <p className={styles.lead}>
        Tus pendientes guardados en este dispositivo (localStorage), con
        prioridad, etiqueta y nota personal.
      </p>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Todavía no agregaste nada. Explorá el{' '}
          <Link to="/buscar">buscador</Link> y sumá títulos desde el detalle.
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => {
            const poster = buildImageUrl(item.posterPath, 'w185');
            return (
              <li key={item.id} className={styles.item}>
                <Link
                  to={`/${item.mediaType}/${item.tmdbId}`}
                  className={styles.itemMain}
                >
                  <div className={styles.thumb}>
                    {poster ? (
                      <img src={poster} alt="" loading="lazy" />
                    ) : (
                      <div className={styles.thumbPlaceholder}>Sin póster</div>
                    )}
                  </div>
                  <div className={styles.itemBody}>
                    <h2 className={styles.itemTitle}>{item.title}</h2>
                    <p className={styles.meta}>
                      {item.mediaType === 'tv' ? 'Serie' : 'Película'} ·
                      Prioridad {item.priority} · {item.category}
                    </p>
                    {item.note ? <p className={styles.note}>{item.note}</p> : null}
                    <p className={styles.meta}>Guardado: {formatDate(item.createdAt)}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeItem(item.id)}
                >
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
