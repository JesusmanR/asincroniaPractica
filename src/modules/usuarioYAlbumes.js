import { getJSON } from '../utils/api.js';
import { preguntar } from '../utils/prompt.js';

/**
 * Ejercicio 2: solicita un username por teclado, busca el usuario que
 * coincida y muestra sus datos junto con todos sus albumes y las fotos
 * de cada album.
 */
export async function buscarUsuarioConAlbumes() {
  try {
    const username = await preguntar('\nEscribe el username a buscar: ');

    // Se filtra directamente en la API (query param) en vez de traer todos
    // los usuarios y filtrar en el cliente: menos datos transferidos.
    const usuariosEncontrados = await getJSON(`/users?username=${encodeURIComponent(username)}`);

    if (usuariosEncontrados.length === 0) {
      console.log(`No se encontro ningun usuario con username "${username}".`);
      return;
    }

    const usuario = usuariosEncontrados[0]; // username es unico en la API, se toma el primero

    console.log('\n=== Datos del usuario ===');
    console.log(`Nombre: ${usuario.name}`);
    console.log(`Username: ${usuario.username}`);
    console.log(`Email: ${usuario.email}`);
    console.log(`Telefono: ${usuario.phone}`);
    console.log(`Empresa: ${usuario.company.name}`);

    // Se piden los albumes del usuario ya encontrado
    const albumes = await getJSON(`/users/${usuario.id}/albums`);

    console.log(`\n=== Albumes de ${usuario.name} (${albumes.length}) ===`);

    // Por cada album se piden sus fotos en paralelo (Promise.all) en vez de
    // una peticion secuencial por album, para reducir el tiempo total.
    const albumesConFotos = await Promise.all(
      albumes.map(async (album) => {
        const fotos = await getJSON(`/albums/${album.id}/photos`);
        return { ...album, fotos };
      })
    );

    albumesConFotos.forEach((album) => {
      console.log(`\n- Album: ${album.title} (${album.fotos.length} foto(s))`);
      album.fotos.forEach((foto) => console.log(`    * ${foto.title} -> ${foto.url}`));
    });
  } catch (error) {
    // Se captura cualquier error de red o de la API para que el programa no se detenga
    console.error('Ocurrio un error al buscar el usuario:', error.message);
  }
}
