import { useState } from 'react';
import { validateContactForm } from '../../application/contact/validateContactForm.js';
import styles from './ContactView.module.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  message: '',
};

/** Coordenadas de la Catedral de La Plata (requisito RF7). */
const MAP_LAT = -34.9215;
const MAP_LNG = -57.9536;
const MAP_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${MAP_LNG - 0.01}%2C${MAP_LAT - 0.008}%2C${MAP_LNG + 0.01}%2C${MAP_LAT + 0.008}&layer=mapnik&marker=${MAP_LAT}%2C${MAP_LNG}`;

export function ContactView() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSuccess('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSuccess('');

    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setForm(EMPTY_FORM);
    setSuccess(
      'Mensaje validado correctamente. Gracias por contactar a PochocleAR Studio.',
    );
  }

  return (
    <div className={styles.page}>
      <section aria-labelledby="contact-title">
        <h1 id="contact-title" className={styles.title}>
          Contacto
        </h1>
        <p className={styles.lead}>
          Escribinos o visitá nuestro estudio en La Plata. El mapa está centrado
          en la Catedral de La Plata.
        </p>
      </section>

      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="studio-title">
          <h2 id="studio-title" className={styles.panelTitle}>
            PochocleAR Studio
          </h2>
          <ul className={styles.infoList}>
            <li>
              <strong>Dirección:</strong> Calle 14 entre 47 y 48, La Plata,
              Buenos Aires, Argentina
            </li>
            <li>
              <strong>Referencia:</strong> Catedral de La Plata (
              {MAP_LAT}, {MAP_LNG})
            </li>
            <li>
              <strong>Email:</strong> hola@pochoclear.studio
            </li>
            <li>
              <strong>Teléfono:</strong> +54 221 555-0134
            </li>
            <li>
              <strong>Horario:</strong> Lun a Vie, 9:00–18:00
            </li>
          </ul>

          <div className={styles.mapWrap}>
            <iframe
              title="Mapa de la Catedral de La Plata"
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className={styles.lead}>
            <a
              href={`https://www.openstreetmap.org/?mlat=${MAP_LAT}&mlon=${MAP_LNG}#map=16/${MAP_LAT}/${MAP_LNG}`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir mapa ampliado
            </a>
          </p>
        </section>

        <section className={styles.panel} aria-labelledby="form-title">
          <h2 id="form-title" className={styles.panelTitle}>
            Enviar mensaje
          </h2>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="contact-name">Nombre</label>
              <input
                id="contact-name"
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email">Correo electrónico</label>
              <input
                id="contact-email"
                className={styles.input}
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message">Mensaje</label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                name="message"
                value={form.message}
                onChange={handleChange}
              />
              {errors.message && <p className={styles.error}>{errors.message}</p>}
            </div>

            <button type="submit" className={styles.button}>
              Enviar
            </button>

            {success && <p className={styles.success}>{success}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}
