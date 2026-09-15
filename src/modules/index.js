// Archivo barril: agrupa y reexporta todas las funcionalidades del proyecto,
// incluida la utilidad de lectura por teclado, para que app.js solo tenga
// que importar este archivo.

export { listarTareasPendientesPorUsuario } from './tareasPendientes.js';
export { buscarUsuarioConAlbumes } from './usuarioYAlbumes.js';
export { filtrarPostsPorNombre } from './filtrarPostsPorNombre.js';
export { obtenerNombresYTelefonos } from './usuariosNombreTelefono.js';
export { obtenerUsuariosEnriquecidos } from './usuariosEnriquecidos.js';
export { preguntar } from '../utils/prompt.js';
