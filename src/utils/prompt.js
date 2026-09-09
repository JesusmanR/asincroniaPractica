import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

/**
 * Solicita un dato por teclado sin bloquear el resto del programa,
 * ya que readline/promises trabaja de forma asincrona con async/await.
 * @param {string} pregunta - Texto que se muestra al usuario.
 * @returns {Promise<string>} Texto ingresado por el usuario, sin espacios extra.
 */
export async function preguntar(pregunta) {
  const rl = readline.createInterface({ input: stdin, output: stdout }); // Se crea la interfaz de lectura sobre la consola
  const respuesta = await rl.question(pregunta); // Se espera (await) la respuesta del usuario sin bloquear el event loop
  rl.close(); // Se cierra la interfaz para liberar la entrada estandar
  return respuesta.trim();
}
