# Plan de pruebas

Datos de prueba usados, por qué se eligieron, cómo se evaluaron, y qué
resultado hace que el programa se considere correcto (o que falle de forma
controlada, siempre con `try/catch`, sin que el programa se detenga).

Datos fijos y conocidos de JSONPlaceholder que se usan como referencia:
10 usuarios, 100 posts (10 por usuario), 500 comentarios (5 por post),
100 álbumes (10 por usuario), 5000 fotos (50 por álbum).

---

## Ejercicio 1 — Tareas pendientes por usuario

- **Datos de prueba**: el dataset completo de la API (`/users` + `/todos`), sin entrada por teclado.
- **Por qué**: es un dataset público y fijo, así el resultado es reproducible por cualquiera que lo corra.
- **Procedimiento**: ejecutar `npm start`, elegir la opción `1`.
- **Resultado esperado (correcto)**: se listan los 10 usuarios; cada uno muestra únicamente las tareas con `completed: false`. La suma de tareas pendientes + completadas de cada usuario debe dar 20 (200 tareas / 10 usuarios).
- **Resultado esperado (error controlado)**: si la API no responde (sin internet, o cambiando `API_BASE_URL` a una URL inválida), el `catch` debe imprimir `"Ocurrio un error al listar las tareas pendientes: ..."` y regresar al menú sin cerrar el programa.

## Ejercicio 2 — Buscar usuario y álbumes

- **Datos de prueba**:
  - `Bret` → username real (usuario 1, Leanne Graham). Caso de éxito.
  - `usuario_inexistente` → no existe en la API. Caso de negocio controlado (no es un error, es "no encontrado").
  - cadena vacía (Enter sin escribir nada). Caso límite.
- **Por qué**: `Bret` permite verificar el enriquecimiento completo (datos + álbumes + fotos) contra un resultado conocido; el inexistente valida el `if (usuariosEncontrados.length === 0)`; la cadena vacía valida que no se rompa con entradas mínimas.
- **Procedimiento**: opción `2`, ingresar cada dato de prueba en ejecuciones separadas.
- **Resultado esperado (correcto)**: con `Bret`, se muestran sus datos y exactamente 10 álbumes, cada uno con 5 fotos.
- **Resultado esperado (no encontrado)**: con `usuario_inexistente`, se imprime `No se encontro ningun usuario con username "usuario_inexistente".` y el programa vuelve al menú.
- **Resultado esperado (error controlado)**: sin conexión a la API, el `catch` informa el error sin detener el programa.

## Ejercicio 3 — Filtrar posts por nombre

- **Datos de prueba**:
  - `qui` → coincide con varios títulos. Caso de éxito con lista larga.
  - `sunt aut facere` → coincide exactamente con el título del post 1. Caso de éxito con resultado único (fácil de verificar a mano).
  - `zzznoexiste` → no coincide con ningún título. Caso de negocio controlado.
- **Por qué**: cubren los tres escenarios posibles del filtro: varios resultados, un resultado exacto, y ninguno.
- **Procedimiento**: opción `3`, un dato de prueba por ejecución.
- **Resultado esperado (correcto)**: con `sunt aut facere` debe listarse exactamente 1 post (el post 1, del usuario 1) con sus comentarios.
- **Resultado esperado (no encontrado)**: con `zzznoexiste`, mensaje `No se encontraron posts cuyo titulo contenga "zzznoexiste".`
- **Resultado esperado (error controlado)**: sin conexión, `catch` informa el error.

## Ejercicio 4 — Usuarios (nombre y teléfono)

- **Datos de prueba**: dataset completo de `/users`, sin entrada por teclado.
- **Por qué**: es determinístico y fácil de verificar (10 filas esperadas).
- **Procedimiento**: opción `4`.
- **Resultado esperado (correcto)**: tabla (`console.table`) con exactamente 10 filas, cada una con solo dos columnas: `nombre` y `telefono` (ningún otro campo del usuario original).
- **Resultado esperado (error controlado)**: sin conexión, `catch` informa el error sin romper el programa.

## Ejercicio 5 — Usuarios enriquecidos

- **Datos de prueba**: dataset completo (usuarios + posts + comentarios + álbumes + fotos), sin entrada por teclado.
- **Por qué**: es el ejercicio que más peticiones combina; usar el dataset completo permite verificar contra números fijos y conocidos.
- **Procedimiento**: opción `5` (tarda varios segundos por la cantidad de peticiones en paralelo).
- **Resultado esperado (correcto)**: los 10 usuarios muestran `Posts: 10`, `Comentarios totales: 50`, `Albumes: 10`, `Fotos totales: 500` cada uno.
- **Resultado esperado (error controlado)**: si cualquiera de las peticiones anidadas falla (por ejemplo sin conexión), el `catch` general lo informa y el programa vuelve al menú en vez de cerrarse.
