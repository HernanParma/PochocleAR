import { createMovie } from '../../domain/entities/Movie.js';
import { createWatchProvider } from '../../domain/entities/WatchProvider.js';
import { createGenre } from '../../domain/entities/Genre.js';
import { assertTmdbConfigured, tmdbConfig } from '../config/tmdbConfig.js';
import { httpGet } from '../http/httpClient.js';

/**
 * Construye una URL de TMDB con api_key, language y query params.
 * @param {string} path - Ruta relativa al baseUrl (ej. /search/movie)
 * @param {Record<string, string|number|boolean|undefined|null>} [params]
 * @returns {string}
 */
function buildTmdbUrl(path, params = {}) {
  assertTmdbConfigured();

  const url = new URL(`${tmdbConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
  url.searchParams.set('api_key', tmdbConfig.apiKey);
  url.searchParams.set('language', tmdbConfig.defaultLanguage);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

/**
 * Normaliza la respuesta paginada de TMDB a un máximo de resultsPerPage ítems.
 * @param {Object} data
 * @param {'movie'|'tv'} mediaType
 */
function mapPagedResults(data, mediaType) {
  const page = Number(data.page) || 1;
  const totalPages = Number(data.total_pages) || 1;
  const rawResults = Array.isArray(data.results) ? data.results : [];
  const results = rawResults
    .slice(0, tmdbConfig.resultsPerPage)
    .map((item) => createMovie(item, mediaType));

  return { results, page, totalPages };
}

/**
 * Adaptador de infraestructura: cliente TMDB vía Fetch API.
 * Implementa el puerto MovieRepository del dominio.
 */
export const tmdbApi = {
  /**
   * Live search de películas.
   * @param {string} query
   * @param {number} [page=1]
   */
  async searchMovies(query, page = 1) {
    const data = await httpGet(
      buildTmdbUrl('/search/movie', { query, page, include_adult: false }),
    );
    return mapPagedResults(data, 'movie');
  },

  /**
   * Live search de series.
   * @param {string} query
   * @param {number} [page=1]
   */
  async searchTv(query, page = 1) {
    const data = await httpGet(
      buildTmdbUrl('/search/tv', { query, page, include_adult: false }),
    );
    return mapPagedResults(data, 'tv');
  },

  /**
   * Discover con filtros: tipo, plataforma AR y género.
   * @param {{ mediaType: 'movie'|'tv', providerId?: number|string, genreId?: number|string }} filters
   * @param {number} [page=1]
   */
  async discover(filters, page = 1) {
    const mediaType = filters.mediaType === 'tv' ? 'tv' : 'movie';
    const path = mediaType === 'tv' ? '/discover/tv' : '/discover/movie';

    const params = {
      page,
      watch_region: tmdbConfig.watchRegion,
      sort_by: 'popularity.desc',
      include_adult: false,
    };

    if (filters.providerId) {
      params.with_watch_providers = filters.providerId;
    }
    if (filters.genreId) {
      params.with_genres = filters.genreId;
    }

    const data = await httpGet(buildTmdbUrl(path, params));
    return mapPagedResults(data, mediaType);
  },

  /**
   * Detalle de película o serie.
   * @param {number} id
   * @param {'movie'|'tv'} mediaType
   */
  async getDetails(id, mediaType) {
    const path = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`;
    const data = await httpGet(buildTmdbUrl(path));
    return createMovie(data, mediaType);
  },

  /**
   * Proveedores de streaming filtrados al nodo AR.
   * @param {number} id
   * @param {'movie'|'tv'} mediaType
   */
  async getWatchProviders(id, mediaType) {
    const path =
      mediaType === 'tv'
        ? `/tv/${id}/watch/providers`
        : `/movie/${id}/watch/providers`;

    const data = await httpGet(buildTmdbUrl(path));
    const ar = data?.results?.AR;

    if (!ar) return [];

    /** @type {import('../../domain/entities/WatchProvider.js').WatchProvider[]} */
    const providers = [];
    const buckets = ['flatrate', 'rent', 'buy', 'ads', 'free'];

    buckets.forEach((offerType) => {
      const list = Array.isArray(ar[offerType]) ? ar[offerType] : [];
      list.forEach((raw) => {
        providers.push(createWatchProvider(raw, offerType));
      });
    });

    return providers;
  },

  /**
   * Catálogo de géneros.
   * @param {'movie'|'tv'} mediaType
   */
  async getGenres(mediaType) {
    const path =
      mediaType === 'tv' ? '/genre/tv/list' : '/genre/movie/list';
    const data = await httpGet(buildTmdbUrl(path));
    const list = Array.isArray(data.genres) ? data.genres : [];
    return list.map(createGenre);
  },

  /**
   * Contenido destacado / popular para Home.
   * @param {'movie'|'tv'} [mediaType='movie']
   * @param {number} [page=1]
   */
  async getTrendingOrPopular(mediaType = 'movie', page = 1) {
    const path =
      mediaType === 'tv' ? '/tv/popular' : '/movie/popular';
    const data = await httpGet(buildTmdbUrl(path, { page }));
    return mapPagedResults(data, mediaType);
  },

  /**
   * Listado de proveedores de watch disponibles en Argentina (para filtros).
   */
  async getWatchProviderCatalog(mediaType = 'movie') {
    const path =
      mediaType === 'tv'
        ? '/watch/providers/tv'
        : '/watch/providers/movie';

    const data = await httpGet(
      buildTmdbUrl(path, { watch_region: tmdbConfig.watchRegion }),
    );
    const list = Array.isArray(data.results) ? data.results : [];
    return list.map((raw) => createWatchProvider(raw, 'flatrate'));
  },
};
