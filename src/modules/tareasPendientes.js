import { getJSON } from '../utils/api.js';

/**
 * Ejercicio 1: Lista todas las tareas pendientes (todos) agrupadas por
 * cada usuario registrado en la API.
 *
 * Estrategia: se piden los usuarios y las tareas en dos peticiones
 * independientes y en paralelo (Promise.all), en lugar de pedir las
 * tareas usuario por usuario, para evitar el problema N+1 peticiones.
 */
export async function listarTareasPendientesPorUsuario() {
  try {
    // Se lanzan ambas peticiones al mismo tiempo; Promise.all espera a que
    // ambas terminen antes de continuar, sin bloquear el hilo principal.
    const [usuarios, tareas] = await Promise.all([
      getJSON('/users'), // Trae todos los usuarios en una sola peticion
      getJSON('/todos'), // Trae todas las tareas de todos los usuarios en una sola peticion
    ]);

    console.log('\n=== Tareas pendientes por usuario ===\n');

    usuarios.forEach((usuario) => {
      // Se filtran solo las tareas de este usuario que aun no estan completadas
      const pendientes = tareas.filter(
        (tarea) => tarea.userId === usuario.id && !tarea.completed
      );

      console.log(`${usuario.name} (@${usuario.username}) - ${pendientes.length} tarea(s) pendiente(s)`);
      if (pendientes.length === 0) {
        console.log('  Sin tareas pendientes.');
      } else {
        pendientes.forEach((tarea) => console.log(`  - ${tarea.title}`));
      }
      console.log(''); // linea en blanco entre usuarios, mejora la legibilidad en terminal
    });
  } catch (error) {
    // Se captura cualquier error de red o de la API para que el programa no se detenga
    console.error('Ocurrio un error al listar las tareas pendientes:', error.message);
  }
}
