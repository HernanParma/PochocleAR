/**
 * Contratos / puertos del dominio.
 * En JS se documentan como interfaces; las implementaciones viven en infrastructure.
 */

/**
 * @typedef {Object} MovieRepository
 * @property {(query: string, page?: number) => Promise<{ results: import('./entities/Movie.js').Movie[], totalPages: number, page: number }>} searchMovies
 * @property {(query: string, page?: number) => Promise<{ results: import('./entities/Movie.js').Movie[], totalPages: number, page: number }>} searchTv
 * @property {(filters: Object, page?: number) => Promise<{ results: import('./entities/Movie.js').Movie[], totalPages: number, page: number }>} discover
 * @property {(id: number, mediaType: 'movie'|'tv') => Promise<import('./entities/Movie.js').Movie>} getDetails
 * @property {(id: number, mediaType: 'movie'|'tv') => Promise<import('./entities/WatchProvider.js').WatchProvider[]>} getWatchProviders
 * @property {(mediaType: 'movie'|'tv') => Promise<import('./entities/Genre.js').Genre[]>} getGenres
 * @property {(mediaType?: 'movie'|'tv', page?: number) => Promise<{ results: import('./entities/Movie.js').Movie[], totalPages: number, page: number }>} getTrendingOrPopular
 */

/**
 * @typedef {Object} WishlistRepository
 * @property {() => import('./entities/WishlistItem.js').WishlistItem[]} getAll
 * @property {(item: import('./entities/WishlistItem.js').WishlistItem) => void} add
 * @property {(id: string) => void} remove
 * @property {(id: string) => boolean} has
 */

/**
 * @typedef {Object} HistoryRepository
 * @property {() => import('./entities/HistoryItem.js').HistoryItem[]} getAll
 * @property {(item: import('./entities/HistoryItem.js').HistoryItem) => void} add
 */
