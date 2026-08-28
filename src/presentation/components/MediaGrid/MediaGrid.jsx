import { MediaCard } from '../MediaCard/MediaCard.jsx';
import styles from './MediaGrid.module.css';

/**
 * @param {{
 *   items: import('../../../domain/entities/Movie.js').Movie[],
 *   labelledBy?: string
 * }} props
 */
export function MediaGrid({ items, labelledBy }) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className={styles.grid} aria-labelledby={labelledBy}>
      {items.map((media) => (
        <li key={`${media.mediaType}-${media.id}`} className={styles.grid__item}>
          <MediaCard media={media} />
        </li>
      ))}
    </ul>
  );
}
