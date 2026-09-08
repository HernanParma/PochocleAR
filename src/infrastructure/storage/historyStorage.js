import { createHistoryItem } from '../../domain/entities/HistoryItem.js';
import { createLocalStorageStore } from './localStorageStore.js';

const store = createLocalStorageStore('pochoclear:history');
const MAX_ITEMS = 50;

/**
 * Orden cronológico inverso 
 */
export const historyStorage = {
  getAll() {
    return store
      .read()
      .map(createHistoryItem)
      .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
  },

  add(item) {
    const normalized = createHistoryItem(item);
    const withoutDuplicate = this.getAll().filter(
      (entry) => entry.id !== normalized.id,
    );
    withoutDuplicate.unshift(normalized);
    store.write(withoutDuplicate.slice(0, MAX_ITEMS));
    return normalized;
  },
};
