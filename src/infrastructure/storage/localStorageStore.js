/**
 * Adaptador genérico sobre localStorage con serialización JSON segura.
 */
export function createLocalStorageStore(storageKey) {
  function read() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function write(items) {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }

  return { read, write };
}
