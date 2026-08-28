import styles from './Pagination.module.css';

/**
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   onChange: (page: number) => void,
 *   disabled?: boolean
 * }} props
 */
export function Pagination({ page, totalPages, onChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const safeTotal = Math.min(totalPages, 500);

  return (
    <nav className={styles.pagination} aria-label="Paginación de resultados">
      <button
        type="button"
        className={styles.pagination__button}
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <p className={styles.pagination__info}>
        Página {page} de {safeTotal}
      </p>
      <button
        type="button"
        className={styles.pagination__button}
        disabled={disabled || page >= safeTotal}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
