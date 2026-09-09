// URL base de la API publica que se usa en toda la practica.
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Realiza una peticion GET a la API y devuelve el JSON ya parseado.
 * Centraliza el manejo de errores HTTP para que cada modulo no tenga
 * que repetir la misma logica de validacion (principio DRY).
 * @param {string} endpoint - Ruta relativa a partir de API_BASE_URL (ej: '/users').
 * @returns {Promise<any>} Datos de la respuesta ya convertidos a JSON.
 */
export async function getJSON(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`); // Se arma la URL completa y se hace la peticion (async, no bloquea el hilo)
  if (!response.ok) {
    // Si la API responde con un codigo de error (4xx, 5xx) se lanza una excepcion
    // para que quien llame a esta funcion la capture con try/catch.
    throw new Error(`Error ${response.status} al consultar ${endpoint}`);
  }
  return response.json(); // Se convierte el cuerpo de la respuesta a un objeto/arreglo de JS
}
