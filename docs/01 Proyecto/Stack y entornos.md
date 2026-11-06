---
tags: [proyecto, tecnico]
---
# Stack y entornos

## Stack
Next.js (App Router, JavaScript) · React · Tailwind CSS · Supabase (PostgreSQL, Auth, RLS) · Vercel · Git y GitHub. Windows + VS Code + PowerShell.

No se agregan frameworks, backends ni servicios pagos sin una decisión registrada en `03 Decisiones`.

## Entornos
| Entorno    | Dónde                         | Base de datos | Para qué                  |
| ---------- | ----------------------------- | ------------- | ------------------------- |
| Local      | `npm run dev`, localhost:3000 | offero-dev    | Programar y probar        |
| Preview    | Vercel, un enlace por PR      | offero-dev    | Revisar antes de fusionar |
| Producción | Vercel, URL principal         | offero-prod   | Solo datos reales         |

- RLS automático activado en ambos proyectos. Solo Wilson (responsable de la base de datos) y Diego (respaldo) ejecutan SQL en prod. Ver [[D-10 Wilson responsable de la base de datos]].
- Cada cambio de esquema es un archivo en `supabase/sql/` con nombre `AAAAMMDD_HHMM_descripcion.sql`.
- La clave secreta (service_role) nunca va al frontend ni a GitHub.
  
  ## Auth (T0-01, 3 nov 2026)
| Proyecto    | Site URL                                       | Redirect URLs            |
| ----------- | ---------------------------------------------- | ------------------------ |
| offero-dev  | http://localhost:3000                          | http://localhost:3000/** |
| offero-prod | http://localhost:3000 *(temporal hasta T0-03)* | http://localhost:3000/** |

- Proveedor Email activo en ambos. «Confirm email» pendiente de [[D-09 Correos de confirmación]] (T0-02).
- Pendiente en T0-03: Site URL de prod → URL de Vercel; en dev agregar `https://*.vercel.app/**` para las previews.

Ver también: [[Esquema de la base de datos]].
