import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

/**
 * detalle completo + proveedores
 * @param {number} id
 * @param {'movie'|'tv'} mediaType
 */
export async function getMediaDetails(id, mediaType) {
  const type = mediaType === 'tv' ? 'tv' : 'movie';
  const [details, providers] = await Promise.all([
    tmdbApi.getDetails(id, type),
    tmdbApi.getWatchProviders(id, type),
  ]);

  return { details, providers };
}
