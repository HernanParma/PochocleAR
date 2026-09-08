/**
 */
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const imageBaseUrl =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const tmdbConfig = Object.freeze({
  apiKey: typeof apiKey === 'string' ? apiKey.trim() : '',
  baseUrl: baseUrl.replace(/\/$/, ''),
  imageBaseUrl: imageBaseUrl.replace(/\/$/, ''),
  defaultLanguage: 'es-AR',
  watchRegion: 'AR',
  resultsPerPage: 10,
});

/**
 * @param {string|null} path
 * @param {'w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original'} [size]
 * @returns {string|null}
 */
export function buildImageUrl(path, size = 'w342') {
  if (!path) return null;
  return `${tmdbConfig.imageBaseUrl}/${size}${path}`;
}

export function assertTmdbConfigured() {
  if (!tmdbConfig.apiKey) {
    throw new Error(
      'Falta VITE_TMDB_API_KEY. Copiá .env.example a .env y cargá tu API Key de TMDB.',
    );
  }
}
