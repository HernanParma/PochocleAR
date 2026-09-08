import { createWishlistItem } from '../../domain/entities/WishlistItem.js';
import { wishlistStorage } from '../../infrastructure/storage/wishlistStorage.js';

/**
 * @param {Object} formData
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateWishlistForm(formData) {
  /** @type {Record<string, string>} */
  const errors = {};

  const priorityRaw = formData.priority;
  const priority = Number(priorityRaw);
  if (
    priorityRaw === undefined ||
    priorityRaw === null ||
    String(priorityRaw).trim() === ''
  ) {
    errors.priority = 'La prioridad / cantidad es obligatoria.';
  } else if (!Number.isFinite(priority) || Math.floor(priority) !== priority) {
    errors.priority = 'La prioridad debe ser un número entero.';
  } else if (priority < 1 || priority > 10) {
    errors.priority = 'La prioridad debe estar entre 1 y 10.';
  }

  const category = String(formData.category ?? '').trim();
  if (!category) {
    errors.category = 'La categoría / etiqueta es obligatoria.';
  } else if (category.length < 2) {
    errors.category = 'La etiqueta debe tener al menos 2 caracteres.';
  } else if (category.length > 40) {
    errors.category = 'La etiqueta no puede superar 40 caracteres.';
  }

  const note = String(formData.note ?? '').trim();
  if (note.length > 280) {
    errors.note = 'La nota no puede superar 280 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function listWishlist() {
  return wishlistStorage.getAll();
}

/**
 * @param {Object} payload
 */
export function addToWishlist(payload) {
  const validation = validateWishlistForm(payload);
  if (!validation.valid) {
    const error = new Error('Validación de lista de deseos fallida.');
    error.name = 'ValidationError';
    error.errors = validation.errors;
    throw error;
  }

  const item = createWishlistItem(payload);
  return wishlistStorage.add(item);
}

export function removeFromWishlist(id) {
  wishlistStorage.remove(id);
}

export function isInWishlist(id) {
  return wishlistStorage.has(id);
}
