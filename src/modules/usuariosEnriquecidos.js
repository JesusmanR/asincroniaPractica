import { getJSON } from '../utils/api.js';

/**
 * Ejercicio 5: solicita todos los usuarios en una unica peticion y los
 * enriquece con:
 *   - sus posts, y a cada post sus comentarios
 *   - sus albumes, y a cada album sus fotografias
 *
 * Cada linea esta comentada explicando por que se escribio y que resuelve.
 */
export async function obtenerUsuariosEnriquecidos() {
  try {
    // Se piden TODOS los usuarios en una unica peticion a la API (requisito explicito del enunciado).
    const usuarios = await getJSON('/users');

    // Se recorren los usuarios con Promise.all para enriquecer a TODOS en paralelo
    // en vez de uno por uno (secuencial), lo que reduce drasticamente el tiempo total.
    const usuariosEnriquecidos = await Promise.all(
      usuarios.map(async (usuario) => {
        // Para cada usuario se piden, en paralelo entre si, sus posts y sus albumes,
        // ya que son peticiones independientes (ninguna depende de la otra).
        const [posts, albumes] = await Promise.all([
          getJSON(`/posts?userId=${usuario.id}`), // posts propios de este usuario
          getJSON(`/albums?userId=${usuario.id}`), // albumes propios de este usuario
        ]);

        // A cada post se le agregan sus comentarios, tambien en paralelo entre posts,
        // porque los comentarios de un post no afectan a los de otro.
        const postsConComentarios = await Promise.all(
          posts.map(async (post) => {
            const comentarios = await getJSON(`/comments?postId=${post.id}`); // comentarios de este post
            return { ...post, comentarios }; // nuevo objeto (post + comentarios), sin mutar el original
          })
        );

        // A cada album se le agregan sus fotografias, tambien en paralelo entre albumes.
        const albumesConFotos = await Promise.all(
          albumes.map(async (album) => {
            const fotos = await getJSON(`/photos?albumId=${album.id}`); // fotos de este album
            return { ...album, fotos }; // nuevo objeto (album + fotos), sin mutar el original
          })
        );

        // Se devuelve el usuario original mas sus posts (ya con comentarios) y sus
        // albumes (ya con fotos), sin mutar el objeto usuario que llego de la API.
        return {
          ...usuario,
          posts: postsConComentarios,
          albumes: albumesConFotos,
        };
      })
    );

    // Se muestra un resumen legible en terminal (el objeto completo seria enorme
    // e ilegible si se imprimiera tal cual).
    console.log('\n=== Usuarios enriquecidos ===\n');
    usuariosEnriquecidos.forEach((usuario) => {
      console.log(`${usuario.name} (@${usuario.username})`); // identificacion del usuario
      console.log(`  Posts: ${usuario.posts.length}`); // cantidad de posts del usuario

      // Se suman los comentarios de todos los posts de este usuario con reduce
      const totalComentarios = usuario.posts.reduce((total, post) => total + post.comentarios.length, 0);
      console.log(`  Comentarios totales en sus posts: ${totalComentarios}`);

      console.log(`  Albumes: ${usuario.albumes.length}`); // cantidad de albumes del usuario

      // Se suman las fotos de todos los albumes de este usuario con reduce
      const totalFotos = usuario.albumes.reduce((total, album) => total + album.fotos.length, 0);
      console.log(`  Fotos totales en sus albumes: ${totalFotos}`);

      console.log(''); // linea en blanco entre usuarios para mejorar la legibilidad
    });

    // Se retorna la estructura completa por si se necesita reutilizar en otro lugar.
    return usuariosEnriquecidos;
  } catch (error) {
    // Se captura cualquier error de red o de la API para que el programa no se detenga
    console.error('Ocurrio un error al enriquecer los usuarios:', error.message);
  }
}
