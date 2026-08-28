import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/buscar', label: 'Buscar' },
  { to: '/lista-deseos', label: 'Lista de deseos' },
  { to: '/historial', label: 'Historial' },
  { to: '/contacto', label: 'Contacto' },
];

function linkClassName({ isActive }) {
  return isActive ? `${styles.navbar__link} ${styles['is-active']}` : styles.navbar__link;
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar__inner}>
        <NavLink to="/" className={styles.navbar__brand} onClick={closeMenu}>
          Pochocle<span>AR</span>
        </NavLink>

        <button
          type="button"
          className={styles.navbar__toggle}
          aria-expanded={open}
          aria-controls="navbar-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Abrir menú</span>
          ☰
        </button>

        <nav aria-label="Principal">
          <ul className={`${styles.navbar__menu} ${styles['navbar__menu--desktop']}`}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClassName}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <nav
        id="navbar-menu"
        aria-label="Principal móvil"
        className={`${styles.navbar__menu} ${styles['navbar__menu--mobile']} ${open ? styles['is-open'] : ''}`}
      >
        <ul className={styles.navbar__menu}>
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={linkClassName}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
