import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

/**
 * filtrado tipo + plataforma + género
 * @param {{
 *   mediaType: 'movie'|'tv',
 *   providerId?: number|string,
 *   genreId?: number|string,
 *   page?: number
 * }} filters
 */
export async function filterMedia(filters) {
  return tmdbApi.discover(
    {
      mediaType: filters.mediaType === 'tv' ? 'tv' : 'movie',
      providerId: filters.providerId,
      genreId: filters.genreId,
    },
    filters.page || 1,
  );
}
