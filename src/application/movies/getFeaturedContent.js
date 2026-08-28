import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

/**
 * Mezcla un arreglo sin mutar el original (Fisher–Yates).
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Caso de uso: contenido destacado / aleatorio para Home.
 * Combina populares de películas y series, mezcla y limita resultados.
 * @param {{ limit?: number, page?: number }} [options]
 */
export async function getFeaturedContent(options = {}) {
  const limit = options.limit ?? 8;
  const page = options.page ?? Math.floor(Math.random() * 3) + 1;

  const [movies, series] = await Promise.all([
    tmdbApi.getTrendingOrPopular('movie', page),
    tmdbApi.getTrendingOrPopular('tv', page),
  ]);

  const mixed = shuffle([...movies.results, ...series.results]).slice(0, limit);

  return {
    results: mixed,
    page,
    totalPages: Math.max(movies.totalPages, series.totalPages),
  };
}
