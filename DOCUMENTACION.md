# Documentación técnica del proceso

Este documento explica, módulo por módulo, cómo está construido el código:
variables y su propósito, tipos de dato, validaciones, estructuras de
control, funciones (con sus parámetros y retornos), y el manejo de
mutabilidad/inmutabilidad.

Relación con las competencias evaluadas: el proyecto usa **estructuras
secuenciales** (flujo de cada función), **estructuras de control**
(condicionales `if`), **estructuras cíclicas** (`while` en el menú,
`forEach`/`map` como iteración sobre colecciones) y **arreglos** (todas
las respuestas de la API se procesan como arrays con `filter`, `map`,
`reduce`).

---

## src/utils/api.js — `getJSON(endpoint)`

- **Propósito**: centralizar toda petición GET a la API y su manejo de errores HTTP, para no repetir esa lógica en cada módulo (DRY).
- **Parámetro**: `endpoint` (`string`) — ruta relativa, ej. `/users`.
- **Retorno**: `Promise<any>` — el cuerpo de la respuesta ya convertido a JSON (objeto o arreglo, según el endpoint).
- **Validación**: revisa `response.ok`; si la API responde con error (4xx/5xx) lanza una excepción (`throw new Error(...)`), que queda disponible para que cada módulo la capture con `try/catch`.
- **Mutabilidad**: no aplica (no recibe estructuras para modificar).

## src/utils/prompt.js — `preguntar(pregunta)`

- **Propósito**: leer datos por teclado sin bloquear el hilo principal (usa `readline/promises`, asíncrono).
- **Parámetro**: `pregunta` (`string`) — texto que se muestra al usuario.
- **Retorno**: `Promise<string>` — el texto ingresado, sin espacios al inicio/final (`.trim()`).
- **Validación**: ninguna sobre el contenido (se delega a cada módulo que la usa).

---

## Ejercicio 1 — `listarTareasPendientesPorUsuario()`

- **Entrada**: ninguna (no pide datos por teclado).
- **Variables**:
  - `usuarios` (`Array<Object>`) — resultado de `GET /users`.
  - `tareas` (`Array<Object>`) — resultado de `GET /todos`.
  - `pendientes` (`Array<Object>`) — subconjunto de `tareas` filtrado por usuario, creado de nuevo en cada iteración (no muta `tareas`).
- **Procesos**: `Promise.all` para pedir usuarios y tareas en paralelo; `Array.prototype.forEach` para recorrer usuarios (equivale al ciclo); `Array.prototype.filter` para obtener las tareas pendientes de cada usuario (`tarea.userId === usuario.id && !tarea.completed`), sin mutar el arreglo original.
- **Condicional**: `if (pendientes.length === 0)` para mostrar "Sin tareas pendientes" en vez de una lista vacía.
- **Retorno**: `undefined` (función de efecto: solo imprime en consola).
- **Errores**: `try/catch` alrededor de todo el cuerpo; si `getJSON` lanza, se captura y se imprime con `console.error` sin detener el programa.

## Ejercicio 2 — `buscarUsuarioConAlbumes()`

- **Entrada**: `username` (`string`), pedido por teclado con `preguntar`.
- **Variables**:
  - `usuariosEncontrados` (`Array<Object>`) — resultado de `GET /users?username=...`.
  - `usuario` (`Object`) — primer elemento de `usuariosEncontrados` (el username es único en la API).
  - `albumes` (`Array<Object>`) — `GET /users/{id}/albums`.
  - `albumesConFotos` (`Array<Object>`) — nuevo arreglo (no muta `albumes`) donde cada álbum es `{ ...album, fotos }`.
- **Validación**: `encodeURIComponent(username)` sanitiza el texto antes de usarlo en la URL; `if (usuariosEncontrados.length === 0)` maneja el caso "usuario no encontrado" con un `return` anticipado (sin lanzar excepción, es un caso de negocio válido, no un error).
- **Procesos**: `albumes.map(async album => ...)` dentro de `Promise.all` para pedir las fotos de todos los álbumes en paralelo.
- **Inmutabilidad**: cada álbum enriquecido es un objeto nuevo (`{ ...album, fotos }`), el original de la API no se toca.
- **Retorno**: `undefined`.
- **Errores**: `try/catch` general; cualquier falla de red o de la API se informa sin detener el programa.

## Ejercicio 3 — `filtrarPostsPorNombre()`

- **Entrada**: `nombreBuscado` (`string`), pedido por teclado.
- **Variables**:
  - `posts` (`Array<Object>`) — `GET /posts` (todos).
  - `postsFiltrados` (`Array<Object>`) — nuevo arreglo vía `filter`, comparando `post.title.toLowerCase().includes(nombreBuscado.toLowerCase())` (búsqueda insensible a mayúsculas).
  - `postsConComentarios` (`Array<Object>`) — cada post enriquecido con `{ ...post, comentarios }`.
- **Validación**: `if (postsFiltrados.length === 0)` corta el flujo con un mensaje, sin llegar a pedir comentarios de nada.
- **Procesos**: `filter` + `Promise.all(postsFiltrados.map(...))` para pedir los comentarios de cada post filtrado en paralelo.
- **Inmutabilidad**: `postsFiltrados` y `postsConComentarios` son arreglos nuevos; `posts` original no se modifica.
- **Retorno**: `undefined`.
- **Errores**: `try/catch` general.

## Ejercicio 4 — `obtenerNombresYTelefonos()`

- **Entrada**: ninguna.
- **Variables**:
  - `usuarios` (`Array<Object>`) — `GET /users`.
  - `nombresYTelefonos` (`Array<{ nombre: string, telefono: string }>`) — transformación inmutable vía `map`, sin tocar `usuarios`.
- **Procesos**: `map` para proyectar cada usuario a un objeto reducido; `console.table` para una salida tabular clara.
- **Retorno**: `Array<{ nombre, telefono }>` — a diferencia de los demás, esta función sí retorna el resultado, por si otro módulo quisiera reutilizarlo.
- **Errores**: `try/catch` general.

## Ejercicio 5 — `obtenerUsuariosEnriquecidos()`

- **Entrada**: ninguna.
- **Variables** (por cada usuario, dentro del `map`):
  - `posts`, `albumes` (`Array<Object>`) — pedidos en paralelo con `Promise.all`.
  - `postsConComentarios`, `albumesConFotos` (`Array<Object>`) — enriquecidos con `Promise.all` + `map`, cada uno como objeto nuevo (spread), sin mutar el original.
  - `totalComentarios`, `totalFotos` (`number`) — calculados con `Array.prototype.reduce` para el resumen impreso.
- **Procesos**: tres niveles de paralelismo con `Promise.all`: (1) todos los usuarios entre sí, (2) posts y álbumes de un mismo usuario entre sí, (3) comentarios de cada post / fotos de cada álbum entre sí. Esto minimiza el tiempo total de espera frente a hacerlo secuencial.
- **Inmutabilidad**: en cada paso se construye un objeto nuevo con spread (`{ ...usuario, posts, albumes }`, `{ ...post, comentarios }`, `{ ...album, fotos }`); los objetos que llegan de la API nunca se modifican directamente.
- **Retorno**: `Array<Object>` — la estructura completa enriquecida, por si se reutiliza.
- **Errores**: `try/catch` general; cualquier falla en cualquiera de las peticiones anidadas es capturada aquí.

## app.js — menú principal

- **`mostrarMenu()`**: sin parámetros, sin retorno (`void`); imprime las opciones con `forEach`.
- **`buscarEjercicio(entrada)`**: parámetro `entrada` (`string`); retorno `Object | undefined` (`Array.prototype.find`), permite elegir por número o por nombre parcial.
- **`main()`**: función asíncrona con un ciclo `while (continuar)` — la estructura cíclica del programa — que mantiene el menú activo hasta que el usuario escribe `0` o "salir" (condicional `if`), momento en que `continuar` cambia a `false` y el ciclo termina.
