// app.js: punto de entrada del programa.
// Unico archivo propio que se importa aqui: el archivo barril de src/modules.
import * as ejerciciosDisponibles from './src/modules/index.js';
import { preguntar } from './src/utils/prompt.js';

/**
 * Catalogo de ejercicios: relaciona un numero y un nombre visible con la
 * funcion que lo resuelve. Agregar un ejercicio nuevo solo implica sumar
 * una entrada aqui (principio DRY: la logica del menu no se repite).
 */
const ejercicios = [
  {
    numero: '1',
    nombre: 'Tareas pendientes por usuario',
    accion: ejerciciosDisponibles.listarTareasPendientesPorUsuario,
  },
  {
    numero: '2',
    nombre: 'Buscar usuario y sus albumes',
    accion: ejerciciosDisponibles.buscarUsuarioConAlbumes,
  },
  {
    numero: '3',
    nombre: 'Filtrar posts por nombre',
    accion: ejerciciosDisponibles.filtrarPostsPorNombre,
  },
  { numero: '4', nombre: 'Usuarios (nombre y telefono)', accion: null },
  { numero: '5', nombre: 'Usuarios enriquecidos (posts, comentarios, albumes, fotos)', accion: null },
];

// Muestra las opciones disponibles en la terminal.
function mostrarMenu() {
  console.log('\n=== Practica de Asincronia - JSONPlaceholder ===');
  ejercicios.forEach(({ numero, nombre }) => console.log(`${numero}. ${nombre}`));
  console.log('0. Salir');
}

/**
 * Busca el ejercicio pedido por el usuario, aceptando tanto el numero
 * como (parte de) el nombre del ejercicio, sin distinguir mayusculas.
 * @param {string} entrada - Texto escrito por el usuario en el menu.
 */
function buscarEjercicio(entrada) {
  const entradaNormalizada = entrada.trim().toLowerCase();
  return ejercicios.find(
    (ejercicio) =>
      ejercicio.numero === entradaNormalizada ||
      ejercicio.nombre.toLowerCase().includes(entradaNormalizada)
  );
}

// Bucle principal: muestra el menu, lee la eleccion y ejecuta el ejercicio,
// hasta que el usuario decide salir.
async function main() {
  let continuar = true;

  while (continuar) {
    mostrarMenu();
    const entrada = await preguntar('\nEscribe el numero o el nombre del ejercicio (0 para salir): ');

    if (entrada === '0' || entrada.toLowerCase() === 'salir') {
      continuar = false;
      console.log('Hasta luego!');
      continue;
    }

    const ejercicio = buscarEjercicio(entrada);

    if (!ejercicio) {
      console.log('Opcion no reconocida, intenta de nuevo.');
      continue;
    }

    if (!ejercicio.accion) {
      console.log(`"${ejercicio.nombre}" todavia no esta implementado.`);
      continue;
    }

    await ejercicio.accion();
  }
}

main();
