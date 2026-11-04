---
tags: [aprendizaje]
fecha: 2026-11-04
autor: Wilson
tema: nextjs
---
# De Flask a Next.js

**Qué pasó:** Tengo experiencia con una app de tareas en Flask, y en Offero trabajo con Next.js. Mucho de lo que ya sé se hace de otra forma, así que comparé rutas, formularios y base de datos.

| Tema | En Flask | En Next.js (Offero) |
|---|---|---|
| Rutas | `@app.route("/tareas")` | Carpeta `src/app/solicitudes/` con su `page.js` |
| Ruta con parámetro | `/tareas/<id>` | Carpeta `[requestId]` |
| Vistas | Plantillas Jinja | Componentes de React (JSX) |
| Formularios | `request.form` en un POST | Server Action que recibe los datos del formulario |
| Base de datos | SQLite | PostgreSQL en Supabase |
| Permisos | `login_required` o revisar permisos en la vista | Protección en el servidor + políticas RLS en la base de datos |
| Correr la app | `flask run` | `npm run dev` |

**Por qué pasó:** En Flask las rutas se declaran en el código con un decorador. En Next.js con App Router, la ruta sale de la estructura de carpetas. Además, en Offero los permisos no dependen solo de la vista: la base de datos también los hace cumplir con RLS.

**Cómo se resolvió:** Relacioné cada cosa que ya sabía con su equivalente:

- **Rutas:** en vez de escribir un decorador, creo una carpeta con un `page.js`.
- **Formularios:** en vez de leer `request.form`, uso una Server Action y valido los datos en el servidor.
- **Base de datos:** las tablas se crean con un archivo en `supabase/sql/` y se protegen con RLS en ese mismo archivo.

**Cómo evitarlo:**

- No pegar código escrito para Flask, para la carpeta `pages/` o para TypeScript. En Offero se usa JavaScript y App Router.
- Poner `"use client"` solo en el componente interactivo, no en toda la página.
- No proteger solo ocultando botones: hay que verificar en el servidor y en RLS.

Relacionado: [[Aprendizaje MOC]]
