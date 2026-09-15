import { getJSON } from '../utils/api.js';
import { preguntar } from '../utils/prompt.js';

/**
 * Ejercicio 3: filtra los posts cuyo titulo contiene el texto ingresado
 * por teclado y le agrega los comentarios a cada post que coincide.
 */
export async function filtrarPostsPorNombre() {
  try {
    const nombreBuscado = await preguntar('\nEscribe el texto a buscar en el titulo del post: ');

    // Se traen todos los posts en una sola peticion
    const posts = await getJSON('/posts');

    // Se filtran los posts cuyo titulo incluye el texto buscado (sin distinguir mayusculas)
    const postsFiltrados = posts.filter((post) =>
      post.title.toLowerCase().includes(nombreBuscado.toLowerCase())
    );

    if (postsFiltrados.length === 0) {
      console.log(`No se encontraron posts cuyo titulo contenga "${nombreBuscado}".`);
      return;
    }

    // Por cada post filtrado se piden sus comentarios en paralelo (Promise.all),
    // en vez de una peticion secuencial por post, para reducir el tiempo total.
    const postsConComentarios = await Promise.all(
      postsFiltrados.map(async (post) => {
        const comentarios = await getJSON(`/posts/${post.id}/comments`);
        return { ...post, comentarios };
      })
    );

    console.log(`\n=== ${postsConComentarios.length} post(s) encontrado(s) ===`);
    postsConComentarios.forEach((post) => {
      console.log(`\n- ${post.title}`);
      console.log(`  ${post.body}`);
      console.log(`  Comentarios (${post.comentarios.length}):`);
      post.comentarios.forEach((comentario) =>
        console.log(`    * ${comentario.name} <${comentario.email}>: ${comentario.body}`)
      );
    });
  } catch (error) {
    // Se captura cualquier error de red o de la API para que el programa no se detenga
    console.error('Ocurrio un error al filtrar los posts:', error.message);
  }
}
