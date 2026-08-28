import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';
import { searchMedia } from './searchMedia.js';
import { filterMedia } from './filterMedia.js';

/**
 * Caso de uso unificado para la vista Búsqueda.
 * - Con texto: live search + filtro de género en cliente.
 * - Sin texto: discover con tipo, plataforma AR y género.
 *
 * @param {{
 *   query?: string,
 *   mediaType?: 'movie'|'tv',
 *   providerId?: string|number,
 *   genreId?: string|number,
 *   page?: number
 * }} input
 */
export async function queryCatalog(input = {}) {
  const query = String(input.query || '').trim();
  const mediaType = input.mediaType === 'tv' ? 'tv' : 'movie';
  const page = Number(input.page) > 0 ? Number(input.page) : 1;
  const genreId = input.genreId ? Number(input.genreId) : null;
  const providerId = input.providerId ? Number(input.providerId) : null;

  if (query) {
    const data = await searchMedia({ query, mediaType, page });
    const results = genreId
      ? data.results.filter((item) => item.genreIds.includes(genreId))
      : data.results;

    return {
      ...data,
      results,
      mode: 'search',
      /** El filtro de plataforma aplica en modo discover (sin texto). */
      providerApplied: false,
    };
  }

  const data = await filterMedia({
    mediaType,
    providerId: providerId || undefined,
    genreId: genreId || undefined,
    page,
  });

  return {
    ...data,
    mode: 'discover',
    providerApplied: Boolean(providerId),
  };
}
