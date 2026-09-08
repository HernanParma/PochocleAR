import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMediaDetails } from '../../application/movies/getMediaDetails.js';
import { registerVisit } from '../../application/history/historyService.js';
import { validateWishlistForm } from '../../application/wishlist/wishlistService.js';
import { buildImageUrl } from '../../infrastructure/config/tmdbConfig.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import styles from './DetailView.module.css';

const EMPTY_FORM = {
  priority: '',
  category: '',
  note: '',
};

export function DetailView() {
  const navigate = useNavigate();
  const { addItem, removeItem, hasItem } = useWishlist();
  const { mediaType: rawType = 'movie', id } = useParams();
  const mediaType = rawType === 'tv' ? 'tv' : 'movie';
  const numericId = Number(id);
  const formRef = useRef(null);

  const [details, setDetails] = useState(null);
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');

  const itemId = `${mediaType}-${numericId}`;
  const saved = hasItem(itemId);

  useEffect(() => {
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setStatus('error');
      setErrorMessage('Identificador de contenido inválido.');
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setStatus('loading');
      setErrorMessage('');
      setShowWishlistForm(false);
      setForm(EMPTY_FORM);
      setFormErrors({});
      setFormMessage('');

      try {
        const data = await getMediaDetails(numericId, mediaType);
        if (cancelled) return;

        setDetails(data.details);
        setProviders(data.providers);
        setStatus('ready');

        registerVisit({
          tmdbId: data.details.id,
          mediaType: data.details.mediaType,
          title: data.details.title,
          posterPath: data.details.posterPath,
        });
      } catch (error) {
        if (cancelled) return;
        setDetails(null);
        setProviders([]);
        setStatus('error');
        setErrorMessage(error?.message || 'No se pudo cargar el detalle.');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mediaType, numericId]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openWishlistForm() {
    setShowWishlistForm(true);
    setFormMessage('');
    setFormErrors({});
  }

  function handleWishlistSubmit(event) {
    event.preventDefault();
    setFormMessage('');

    const validation = validateWishlistForm(form);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});

    try {
      addItem({
        tmdbId: details.id,
        mediaType: details.mediaType,
        title: details.title,
        posterPath: details.posterPath,
        priority: form.priority,
        category: form.category,
        note: form.note,
      });
      setShowWishlistForm(false);
      setForm(EMPTY_FORM);
      navigate('/lista-deseos');
    } catch (error) {
      if (error?.name === 'ValidationError') {
        setFormErrors(error.errors || {});
        return;
      }
      setFormMessage(error?.message || 'No se pudo guardar en la lista.');
    }
  }

  function handleRemoveFromWishlist() {
    removeItem(itemId);
    setFormMessage('Eliminado de la lista de deseos.');
    setShowWishlistForm(false);
  }

  if (status === 'loading') {
    return (
      <p className={styles.status} role="status">
        Cargando detalle…
      </p>
    );
  }

  if (status === 'error' || !details) {
    return (
      <div className={styles.detail}>
        <p className={`${styles.status} ${styles['status--error']}`} role="alert">
          {errorMessage}
        </p>
        <button type="button" className={styles.buttonSecondary} onClick={() => navigate(-1)}>
          Volver atrás
        </button>
      </div>
    );
  }

  const posterUrl = buildImageUrl(details.posterPath, 'w500');
  const year = details.releaseDate ? details.releaseDate.slice(0, 4) : null;
  const typeLabel = details.mediaType === 'tv' ? 'Serie' : 'Película';
  const rating =
    typeof details.voteAverage === 'number' && details.voteAverage > 0
      ? details.voteAverage.toFixed(1)
      : null;
  const uniqueProviders = providers.filter(
    (provider, index, list) =>
      list.findIndex((item) => item.providerId === provider.providerId) === index,
  );

  return (
    <article className={styles.detail}>
      {formMessage && <p className={styles.success}>{formMessage}</p>}

      {showWishlistForm && (
        <div className={styles.modalBackdrop}>
          <section
            ref={formRef}
            className={styles.wishlistPanel}
            aria-labelledby="wishlist-form-title"
          >
            <header className={styles.wishlistPanel__header}>
              <div>
                <p className={styles.wishlistPanel__eyebrow}>Lista de deseos</p>
                <h2 id="wishlist-form-title" className={styles.wishlistPanel__title}>
                  Guardar “{details.title}”
                </h2>
              </div>
              <button
                type="button"
                className={styles.wishlistPanel__close}
                onClick={() => setShowWishlistForm(false)}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </header>

            <form className={styles.wishlistForm} onSubmit={handleWishlistSubmit} noValidate>
              <div className={styles.wishlistForm__row}>
                <div className={styles.field}>
                  <label htmlFor="wishlist-priority">Prioridad (1-10)</label>
                  <input
                    id="wishlist-priority"
                    className={`${styles.input} ${formErrors.priority ? styles['input--error'] : ''}`}
                    name="priority"
                    inputMode="numeric"
                    value={form.priority}
                    onChange={handleFormChange}
                    placeholder="Ej. 5"
                  />
                  {formErrors.priority && <p className={styles.error}>{formErrors.priority}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="wishlist-category">Etiqueta</label>
                  <input
                    id="wishlist-category"
                    className={`${styles.input} ${formErrors.category ? styles['input--error'] : ''}`}
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    placeholder="Finde, Terror, Clásicos…"
                  />
                  {formErrors.category && <p className={styles.error}>{formErrors.category}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="wishlist-note">Nota personal (opcional)</label>
                <textarea
                  id="wishlist-note"
                  className={`${styles.textarea} ${formErrors.note ? styles['input--error'] : ''}`}
                  name="note"
                  value={form.note}
                  onChange={handleFormChange}
                  placeholder="¿Por qué querés verla?"
                />
                {formErrors.note && <p className={styles.error}>{formErrors.note}</p>}
              </div>

              <div className={styles.wishlistForm__footer}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => setShowWishlistForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar en lista
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.poster}>
          {posterUrl ? (
            <img src={posterUrl} alt={`Póster de ${details.title}`} />
          ) : (
            <div className={styles.posterPlaceholder}>Sin póster</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{details.title}</h1>
          {details.tagline ? <p className={styles.tagline}>{details.tagline}</p> : null}
          <p className={styles.meta}>
            {typeLabel}
            {year ? ` · ${year}` : ''}
            {details.runtime ? ` · ${details.runtime} min` : ''}
            {rating ? ` · ★ ${rating}` : ''}
          </p>
          {details.genres?.length > 0 && (
            <p className={styles.meta}>
              {details.genres.map((genre) => genre.name).join(' · ')}
            </p>
          )}
          <p className={styles.overview}>
            {details.overview || 'Sin sinopsis disponible.'}
          </p>

          <div className={styles.actions}>
            {!saved ? (
              <button type="button" className={styles.button} onClick={openWishlistForm}>
                Agregar a lista de deseos
              </button>
            ) : (
              <button
                type="button"
                className={styles.buttonDanger}
                onClick={handleRemoveFromWishlist}
              >
                Quitar de lista de deseos
              </button>
            )}
          </div>
        </div>
      </div>

      <section aria-labelledby="providers-title">
        <h2 id="providers-title" className={styles.sectionTitle}>
          Disponible en Argentina
        </h2>
        {uniqueProviders.length === 0 ? (
          <p className={styles.status}>
            No hay plataformas de streaming disponibles para este título en Argentina actualmente.
          </p>
        ) : (
          <ul className={styles.providers}>
            {uniqueProviders.map((provider) => {
              const logo = buildImageUrl(provider.logoPath, 'w92');
              return (
                <li key={provider.providerId} className={styles.provider}>
                  {logo ? (
                    <img src={logo} alt="" />
                  ) : (
                    <span aria-hidden="true">TV</span>
                  )}
                  <p className={styles.providerName}>{provider.providerName}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}