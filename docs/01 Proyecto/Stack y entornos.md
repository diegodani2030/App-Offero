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
  
## Auth (actualizado en T0-03, 6 nov 2026)
| Proyecto | Site URL | Redirect URLs |
|---|---|---|
| offero-dev | http://localhost:3000 | http://localhost:3000/** · https://*-diegos-projects-30eaebcb.vercel.app/** |
| offero-prod | https://app-offero.vercel.app | http://localhost:3000/** · https://app-offero.vercel.app/** |

- Proveedor Email activo en ambos. «Confirm email» desactivado en ambos: ver [[D-09 Correos de confirmación]].
- Las previews de Vercel solo se autorizan para esta cuenta, no para todo `*.vercel.app`.

## Vercel
- Producción: https://app-offero.vercel.app · Root Directory: `app-offero`.
- Variables: Production usa offero-prod; Preview y Development usan offero-dev.

Ver también: [[Esquema de la base de datos]].
