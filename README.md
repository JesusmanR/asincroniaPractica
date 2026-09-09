# Practica de Asincronia en JavaScript

Proyecto de la actividad "Asincronia practico" del programa Tecnico en
Programacion de Software (SENA - CIMI), instructor John Freddy Becerra
Castellanos. Consume la API publica
[JSONPlaceholder](https://jsonplaceholder.typicode.com/) usando
`fetch`, `async/await` y `try/catch`.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo, sin dependencias externas)

## Instalacion y ejecucion

```bash
npm install
npm start
```

Se muestra un menu interactivo: se elige el ejercicio por su **numero**
o escribiendo (parte de) su **nombre**.

## Estructura del proyecto

```
Practica/
├── app.js                        # Punto de entrada: menu interactivo (unico import propio: el barril)
├── src/
│   ├── modules/
│   │   ├── index.js              # Archivo barril: agrupa y exporta todos los modulos
│   │   ├── tareasPendientes.js       # Ejercicio 1
│   │   ├── usuarioYAlbumes.js        # Ejercicio 2
│   │   ├── filtrarPostsPorNombre.js  # Ejercicio 3
│   │   ├── usuariosNombreTelefono.js # Ejercicio 4
│   │   └── usuariosEnriquecidos.js   # Ejercicio 5
│   └── utils/
│       ├── api.js                # Helper centralizado de peticiones GET + manejo de errores HTTP
│       └── prompt.js             # Helper para leer datos por teclado de forma asincrona
```

## Ejercicios

1. Listar tareas pendientes por cada usuario
2. Buscar usuario por `username` (por teclado) + sus albumes y fotos
3. Filtrar posts por nombre (por teclado) + agregar sus comentarios
4. Todos los usuarios reducidos a `{ nombre, telefono }`
5. Todos los usuarios enriquecidos con sus posts (+comentarios) y sus
   albumes (+fotos), en una unica peticion base de usuarios

## Flujo de trabajo con Git

- `main`: version estable/entregable
- `develop`: integracion de los ejercicios ya terminados
- `feature/<nombre-ejercicio>`: una rama por ejercicio, que se integra
  a `develop` mediante merge cuando queda terminado

## Estado de avance

- [x] Estructura base del proyecto
- [ ] Ejercicio 1 - Tareas pendientes por usuario
- [ ] Ejercicio 2 - Usuario y albumes
- [ ] Ejercicio 3 - Filtrar posts
- [ ] Ejercicio 4 - Nombre y telefono
- [ ] Ejercicio 5 - Usuarios enriquecidos
