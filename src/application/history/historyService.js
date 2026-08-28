import { createHistoryItem } from '../../domain/entities/HistoryItem.js';
import { historyStorage } from '../../infrastructure/storage/historyStorage.js';

export function listHistory() {
  return historyStorage.getAll();
}

/**
 * Registro automático e invisible al visitar un detalle.
 * @param {{ tmdbId: number, mediaType: 'movie'|'tv', title: string, posterPath?: string|null }} payload
 */
export function registerVisit(payload) {
  const item = createHistoryItem(payload);
  return historyStorage.add(item);
}
