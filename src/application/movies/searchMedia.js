import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

/**
 * búsqueda por texto.
 * @param {{ query: string, mediaType?: 'movie'|'tv', page?: number }} input
 */
export async function searchMedia(input) {
  const query = String(input.query || '').trim();
  const page = input.page || 1;
  const mediaType = input.mediaType === 'tv' ? 'tv' : 'movie';

  if (!query) {
    return { results: [], page: 1, totalPages: 0 };
  }

  if (mediaType === 'tv') {
    return tmdbApi.searchTv(query, page);
  }
  return tmdbApi.searchMovies(query, page);
}
