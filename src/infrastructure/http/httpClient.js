/**
 */

export class HttpError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {unknown} [body]
   */
  constructor(message, status, body) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export class NetworkError extends Error {
  /**
   * @param {string} message
   * @param {unknown} [cause]
   */
  constructor(message, cause) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function httpGet(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    throw new NetworkError(
      'No se pudo conectar con el servidor. Verificá tu conexión a internet.',
      error,
    );
  }

  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const detail =
      body && typeof body === 'object' && 'status_message' in body
        ? String(body.status_message)
        : response.statusText;

    throw new HttpError(
      `Error HTTP ${response.status}: ${detail || 'respuesta no exitosa'}`,
      response.status,
      body,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new HttpError(
      'La respuesta del servidor no es un JSON válido.',
      response.status,
      null,
    );
  }
}
