---
tags: [proyecto, tecnico]
---
# Stack y entornos

## Stack
Next.js (App Router, JavaScript) · React · Tailwind CSS · Supabase (PostgreSQL, Auth, RLS) · Vercel · Git y GitHub. Windows + VS Code + PowerShell.

No se agregan frameworks, backends ni servicios pagos sin una decisión registrada en `03 Decisiones`.

## Entornos
| Entorno | Dónde | Base de datos | Para qué |
|---|---|---|---|
| Local | `npm run dev`, localhost:3000 | offero-dev | Programar y probar |
| Preview | Vercel, un enlace por PR | offero-dev | Revisar antes de fusionar |
| Producción | Vercel, URL principal | offero-prod | Solo datos reales |

- RLS automático activado en ambos proyectos. Solo Diego ejecuta SQL en prod.
- Cada cambio de esquema es un archivo en `supabase/sql/` con nombre `AAAAMMDD_HHMM_descripcion.sql`.
- La clave secreta (service_role) nunca va al frontend ni a GitHub.

Ver también: [[Esquema de la base de datos]].
