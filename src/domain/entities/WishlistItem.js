/**
 * Ítem de la Lista de Deseos (Variante B: formulario de preferencias).
 * @typedef {Object} WishlistItem
 * @property {string} id - Identificador compuesto `${mediaType}-${tmdbId}`
 * @property {number} tmdbId
 * @property {'movie'|'tv'} mediaType
 * @property {string} title
 * @property {string|null} posterPath
 * @property {number} priority - Prioridad / cantidad (numérico)
 * @property {string} category - Etiqueta personalizada
 * @property {string} note - Nota opcional
 * @property {string} createdAt - ISO 8601
 */

/**
 * @param {Object} input
 * @returns {WishlistItem}
 */
export function createWishlistItem(input) {
  const mediaType = input.mediaType === 'tv' ? 'tv' : 'movie';
  const tmdbId = Number(input.tmdbId);

  return {
    id: `${mediaType}-${tmdbId}`,
    tmdbId,
    mediaType,
    title: String(input.title || '').trim(),
    posterPath: input.posterPath ?? null,
    priority: Number(input.priority),
    category: String(input.category || '').trim(),
    note: String(input.note || '').trim(),
    createdAt: input.createdAt || new Date().toISOString(),
  };
}
