import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

const PRIORITY_PROVIDER_IDS = [
  8, // Netflix
  119, // Amazon Prime Video
  337, // Disney+
  1899, // Max
  384, // HBO Max 
  531, // Paramount+
  350, // Apple TV+
  619, // Star+
  283, // Crunchyroll
  2, // Apple TV 
  3, // Google Play Movies
  11, // MUBI
];

/**
 * @param {'movie'|'tv'} mediaType
 */
export async function getFilterCatalogs(mediaType = 'movie') {
  const type = mediaType === 'tv' ? 'tv' : 'movie';
  const [genres, providersRaw] = await Promise.all([
    tmdbApi.getGenres(type),
    tmdbApi.getWatchProviderCatalog(type),
  ]);

  const byId = new Map(providersRaw.map((provider) => [provider.providerId, provider]));
  const prioritized = [];

  PRIORITY_PROVIDER_IDS.forEach((id) => {
    const match = byId.get(id);
    if (match) {
      prioritized.push(match);
    }
  });

  return {
    genres: genres.sort((a, b) => a.name.localeCompare(b.name, 'es')),
    providers: prioritized,
  };
}
