---
tags: [decision]
id: D-12
estado: Tomada
fecha: 2026-11-11
---
# D-12 · Cache Components desactivado en el MVP

- **Estado:** Tomada (11 nov 2026)
- **Decide:** Diego (PO), después de la [[Auditoría del MVP (nov 2026)|auditoría del MVP]]
- **Contexto:** El proyecto base se creó con `cacheComponents: true` y `partialPrefetching: true` en `next.config.mjs`. Con Cache Components, toda página que lea la sesión (las cookies) tiene que ir dentro de `<Suspense>`, o la app no compila. Casi todas las páginas de Offero dependen del usuario, y ni la guía de Supabase ni la mayoría de tutoriales usan esta forma de trabajar.
- **Decisión:** Quitar `cacheComponents` y `partialPrefetching` de `next.config.mjs` durante el MVP. Se mantienen `reactCompiler` y la configuración de Tailwind. Se aplica en T1-01 (#94).
- **Alternativas:** Mantenerlo y resolver el `<Suspense>` dentro del patrón de autenticación (T1-02): navegaciones más rápidas, pero un concepto más que cada integrante tendría que entender en su primera página.
- **Motivo:** El equipo está aprendiendo React y Next.js. Cada concepto que se quita del camino es tiempo que va al flujo principal. La velocidad extra no importa para un piloto con pocas empresas.
- **Consecuencias:**
  - Las páginas que leen la sesión se renderizan en cada petición, automáticamente. No hace falta `<Suspense>` ni `use cache`.
  - Ninguna página con datos de un usuario queda guardada en caché para otro.
  - Las prácticas Next 2 y Next 4 mencionan Cache Components: ya no aplica, el mensaje de error que piden leer no va a aparecer.
  - Se puede reactivar después del MVP, página por página, siguiendo `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.

Volver a [[Registro de decisiones]]
