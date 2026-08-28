/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * @param {Object} raw
 * @returns {Genre}
 */
export function createGenre(raw) {
  return {
    id: Number(raw.id),
    name: String(raw.name || ''),
  };
}
