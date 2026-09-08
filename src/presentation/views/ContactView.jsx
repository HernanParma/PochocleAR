import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { validateContactForm } from '../../application/contact/validateContactForm.js';
import styles from './ContactView.module.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const EMPTY_FORM = {
  name: '',
  email: '',
  message: '',
};

const MAP_LAT = -34.9215;
const MAP_LNG = -57.9536;

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
      '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 id="contact-title" className={styles.title}>
          Contacto
        </h1>
        <p className={styles.lead}>
          Escribinos tus consultas o visitanos en nuestro estudio.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="studio-title">
          <h2 id="studio-title" className={styles.panelTitle}>
            PochocleAR Studio
          </h2>
          <ul className={styles.infoList}>
            <li>
              <strong>Dirección:</strong> Calle 14 entre 47 y 48, La Plata, Buenos Aires
            </li>
            <li>
              <strong>Email:</strong> hola@pochoclear.studio
            </li>
            <li>
              <strong>Teléfono:</strong> +54 221 555-0134
            </li>
            <li>
              <strong>Horario:</strong> Lunes a viernes, 9:00 a 18:00 hs
            </li>
          </ul>

          <div className={styles.mapContainerWrap}>
            <MapContainer
              center={[MAP_LAT, MAP_LNG]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[MAP_LAT, MAP_LNG]}>
                <Popup>
                  PochocleAR Studio <br /> Catedral de La Plata
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="form-title">
          <h2 id="form-title" className={styles.panelTitle}>
            Envianos un mensaje
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
                placeholder="Tu nombre"
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
                placeholder="tu@correo.com"
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
                placeholder="¿En qué podemos ayudarte?"
              />
              {errors.message && <p className={styles.error}>{errors.message}</p>}
            </div>

            <button type="submit" className={styles.button}>
              Enviar mensaje
            </button>

            {success && <p className={styles.success}>{success}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}
