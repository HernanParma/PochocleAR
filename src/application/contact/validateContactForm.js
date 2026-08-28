/**
 * Validación estricta en JavaScript del formulario de Contacto.
 * @param {Object} formData
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateContactForm(formData) {
  /** @type {Record<string, string>} */
  const errors = {};

  const name = String(formData.name ?? '').trim();
  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  const email = String(formData.email ?? '').trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Ingresá un correo electrónico válido.';
  }

  const message = String(formData.message ?? '').trim();
  if (!message) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (message.length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  } else if (message.length > 1000) {
    errors.message = 'El mensaje no puede superar 1000 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
