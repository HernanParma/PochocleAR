/**
 * @typedef {Object} WatchProvider
 * @property {number} providerId
 * @property {string} providerName
 * @property {string|null} logoPath
 * @property {'flatrate'|'rent'|'buy'|'ads'|'free'} offerType
 */

/**
 * @param {Object} raw
 * @param {'flatrate'|'rent'|'buy'|'ads'|'free'} offerType
 * @returns {WatchProvider}
 */
export function createWatchProvider(raw, offerType) {
  return {
    providerId: Number(raw.provider_id),
    providerName: raw.provider_name || 'Desconocido',
    logoPath: raw.logo_path ?? null,
    offerType,
  };
}
