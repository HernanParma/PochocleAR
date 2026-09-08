import { Link } from 'react-router-dom';
import { buildImageUrl } from '../../infrastructure/config/tmdbConfig.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import styles from './WishlistView.module.css';

export function WishlistView() {
  const { items, removeItem } = useWishlist();

  const sortedItems = [...items].sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));

  return (
    <section className={styles.page} aria-labelledby="wishlist-title">
      <div className={styles.intro}>
        <h1 id="wishlist-title" className={styles.title}>
          Lista de deseos
        </h1>
        <p className={styles.lead}>
          Tus películas y series pendientes para ver más adelante.
        </p>
        {items.length > 0 && (
          <span className={styles.counter}>
            {items.length} {items.length === 1 ? 'título guardado' : 'títulos guardados'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Todavía no guardaste nada. Explorá el{' '}
          <Link to="/buscar">buscador</Link> y sumá títulos desde el detalle.
        </p>
      ) : (
        <ul className={styles.list}>
          {sortedItems.map((item) => {
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
                      {item.mediaType === 'tv' ? 'Serie' : 'Película'}
                      {item.priority ? ` · Prioridad ${item.priority}` : ''}
                      {item.category ? ` · ${item.category}` : ''}
                    </p>
                    {item.note ? <p className={styles.note}>{item.note}</p> : null}
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