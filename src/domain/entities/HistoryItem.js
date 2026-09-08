/**
 * @typedef {Object} HistoryItem
 * @property {string} id - Identificador compuesto `${mediaType}-${tmdbId}`
 * @property {number} tmdbId
 * @property {'movie'|'tv'} mediaType
 * @property {string} title
 * @property {string|null} posterPath
 * @property {string} visitedAt - ISO 8601
 */

/**
 * @param {Object} input
 * @returns {HistoryItem}
 */
export function createHistoryItem(input) {
  const mediaType = input.mediaType === 'tv' ? 'tv' : 'movie';
  const tmdbId = Number(input.tmdbId);

  return {
    id: `${mediaType}-${tmdbId}`,
    tmdbId,
    mediaType,
    title: String(input.title || '').trim(),
    posterPath: input.posterPath ?? null,
    visitedAt: input.visitedAt || new Date().toISOString(),
  };
}
