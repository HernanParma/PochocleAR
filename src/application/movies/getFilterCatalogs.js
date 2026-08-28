import { tmdbApi } from '../../infrastructure/tmdb/tmdbApi.js';

/** Proveedores frecuentes en AR (IDs TMDB) para priorizar en el filtro. */
const PRIORITY_PROVIDER_IDS = [
  8, // Netflix
  119, // Amazon Prime Video
  337, // Disney+
  1899, // Max
  384, // HBO Max (legacy)
  531, // Paramount+
  350, // Apple TV+
  619, // Star+
  283, // Crunchyroll
  2, // Apple TV (store)
  3, // Google Play Movies
  11, // MUBI
];

/**
 * Catálogos para el panel de filtrado avanzado.
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
      byId.delete(id);
    }
  });

  const rest = [...byId.values()]
    .sort((a, b) => a.providerName.localeCompare(b.providerName, 'es'))
    .slice(0, 20);

  return {
    genres: genres.sort((a, b) => a.name.localeCompare(b.name, 'es')),
    providers: [...prioritized, ...rest],
  };
}
