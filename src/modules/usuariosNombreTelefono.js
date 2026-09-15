import { getJSON } from '../utils/api.js';

/**
 * Ejercicio 4: consulta todos los usuarios y transforma la respuesta en
 * un nuevo arreglo que contiene unicamente el nombre y el telefono de
 * cada uno.
 */
export async function obtenerNombresYTelefonos() {
  try {
    const usuarios = await getJSON('/users');

    // Se usa map para transformar cada usuario en un objeto reducido,
    // sin mutar el arreglo original (los datos originales no se necesitan mas).
    const nombresYTelefonos = usuarios.map((usuario) => ({
      nombre: usuario.name,
      telefono: usuario.phone,
    }));

    console.log('\n=== Usuarios (nombre y telefono) ===\n');
    console.table(nombresYTelefonos); // salida tabular, clara y facil de leer en terminal

    return nombresYTelefonos; // se retorna por si otro modulo quisiera reutilizar el resultado
  } catch (error) {
    // Se captura cualquier error de red o de la API para que el programa no se detenga
    console.error('Ocurrio un error al consultar los usuarios:', error.message);
  }
}
