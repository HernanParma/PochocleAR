import { createWishlistItem } from '../../domain/entities/WishlistItem.js';
import { createLocalStorageStore } from './localStorageStore.js';

const store = createLocalStorageStore('pochoclear:wishlist');

/**
 */
export const wishlistStorage = {
  getAll() {
    return store.read().map(createWishlistItem);
  },

  add(item) {
    const normalized = createWishlistItem(item);
    const current = this.getAll().filter((entry) => entry.id !== normalized.id);
    current.unshift(normalized);
    store.write(current);
    return normalized;
  },

  remove(id) {
    const next = this.getAll().filter((entry) => entry.id !== id);
    store.write(next);
  },

  has(id) {
    return this.getAll().some((entry) => entry.id === id);
  },
};
