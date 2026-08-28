import { Link } from 'react-router-dom';
import { buildImageUrl } from '../../../infrastructure/config/tmdbConfig.js';
import styles from './MediaCard.module.css';

/**
 * @param {{ media: import('../../../domain/entities/Movie.js').Movie }} props
 */
export function MediaCard({ media }) {
  const posterUrl = buildImageUrl(media.posterPath, 'w342');
  const year = media.releaseDate ? media.releaseDate.slice(0, 4) : null;
  const typeLabel = media.mediaType === 'tv' ? 'Serie' : 'Película';
  const rating =
    typeof media.voteAverage === 'number' && media.voteAverage > 0
      ? media.voteAverage.toFixed(1)
      : null;

  return (
    <Link
      to={`/${media.mediaType}/${media.id}`}
      className={styles.card}
      aria-label={`${media.title} (${typeLabel})`}
    >
      <div className={styles.card__poster}>
        {posterUrl ? (
          <img src={posterUrl} alt="" loading="lazy" />
        ) : (
          <div className={styles.card__placeholder}>Sin póster</div>
        )}
      </div>
      <div className={styles.card__body}>
        <h3 className={styles.card__title}>{media.title}</h3>
        <p className={styles.card__meta}>
          {typeLabel}
          {year ? ` · ${year}` : ''}
          {rating ? ` · ★ ${rating}` : ''}
        </p>
      </div>
    </Link>
  );
}
