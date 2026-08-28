import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  addToWishlist as addToWishlistUseCase,
  isInWishlist as isInWishlistUseCase,
  listWishlist,
  removeFromWishlist as removeFromWishlistUseCase,
} from '../../application/wishlist/wishlistService.js';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => listWishlist());

  const refresh = useCallback(() => {
    setItems(listWishlist());
  }, []);

  const addItem = useCallback((payload) => {
    const saved = addToWishlistUseCase(payload);
    setItems(listWishlist());
    return saved;
  }, []);

  const removeItem = useCallback((id) => {
    removeFromWishlistUseCase(id);
    setItems(listWishlist());
  }, []);

  const hasItem = useCallback(
    (id) => items.some((item) => item.id === id) || isInWishlistUseCase(id),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      refresh,
      addItem,
      removeItem,
      hasItem,
    }),
    [items, refresh, addItem, removeItem, hasItem],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de WishlistProvider.');
  }
  return context;
}
