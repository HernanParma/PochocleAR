/**
 * @typedef {'movie' | 'tv'} MediaType
 */

/**
 * @typedef {Object} MovieGenre
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} Movie
 * @property {number} id
 * @property {MediaType} mediaType
 * @property {string} title
 * @property {string} overview
 * @property {string} tagline
 * @property {string|null} posterPath
 * @property {string|null} backdropPath
 * @property {string|null} releaseDate
 * @property {number|null} voteAverage
 * @property {number|null} runtime
 * @property {number[]} genreIds
 * @property {MovieGenre[]} genres
 */

/**
 * Crea una entidad Movie normalizada desde datos crudos de TMDB.
 * @param {Object} raw
 * @param {MediaType} [forcedType]
 * @returns {Movie}
 */
export function createMovie(raw, forcedType) {
  const mediaType =
    forcedType ||
    raw.media_type ||
    (raw.title !== undefined ? 'movie' : 'tv');

  const genres = Array.isArray(raw.genres)
    ? raw.genres.map((genre) => ({
        id: Number(genre.id),
        name: String(genre.name || ''),
      }))
    : [];

  const genreIds = Array.isArray(raw.genre_ids)
    ? raw.genre_ids.map(Number)
    : genres.map((genre) => genre.id);

  const runtimeFromTv = Array.isArray(raw.episode_run_time)
    ? raw.episode_run_time[0]
    : null;

  return {
    id: Number(raw.id),
    mediaType,
    title: raw.title || raw.name || 'Sin título',
    overview: raw.overview || '',
    tagline: raw.tagline || '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.release_date || raw.first_air_date || null,
    voteAverage:
      typeof raw.vote_average === 'number' ? raw.vote_average : null,
    runtime:
      typeof raw.runtime === 'number'
        ? raw.runtime
        : typeof runtimeFromTv === 'number'
          ? runtimeFromTv
          : null,
    genreIds,
    genres,
  };
}
