import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <p className={styles.footer__brand}>
          Pochocle<span>AR</span>
        </p>
        <p className={styles.footer__text}>
          Descubrí dónde ver tus películas y series favoritas.
        </p>
        <p className={styles.footer__copy}>
          © {year} PochocleAR
        </p>
      </div>
    </footer>
  );
}
