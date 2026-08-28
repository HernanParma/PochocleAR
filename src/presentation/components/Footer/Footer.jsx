import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <p className={styles.footer__brand}>
          Pochocle<span>AR</span>
        </p>
        <p>
          Explorá películas y series en streaming disponibles en Argentina.
        </p>
        <p>© {year} · Trabajo Integrador · Aplicaciones Móviles</p>
      </div>
    </footer>
  );
}
