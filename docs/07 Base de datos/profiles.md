---
tags: [tabla]
responsable: Diego
creada_en_dev: 2026-11-07
creada_en_prod: 2026-11-07
archivo_sql:
  - supabase/sql/20261107_1634_profiles.sql
  - supabase/sql/20261107_2038_profiles_rls.sql
---
# Tabla `profiles`

**Responsable:** Diego · **Módulo:** [[M1 Autenticación y roles]]
Perfil de cada usuario con su rol (client, provider, admin). Se crea solo al registrarse (trigger).

## Campos
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | Clave primaria; es el mismo id de `auth.users`. Se borra en cascada si se borra el usuario. |
| full_name | text | Obligatorio, de 2 a 100 caracteres. |
| email | text | Copia informativa. Nunca se muestra a otros usuarios. |
| role | text | `client`, `provider` o `admin` (CHECK). Por defecto `client`. |
| is_suspended | boolean | Por defecto `false`. Lo usa Iker en M7 para suspender cuentas. |
| created_at | timestamptz | Automático (`now()`). |

## Creación automática
- La función `handle_new_user()` y el trigger `on_auth_user_created` crean el perfil al insertarse un usuario en `auth.users`.
- Toman `full_name` y `role` de los datos del registro. Si el rol no es `client` ni `provider`, guardan `client`: nadie se registra como admin.
- Si no llega nombre (por ejemplo, un usuario creado desde el panel), usan el inicio del correo.
- Los permisos se leen siempre de `profiles.role`, nunca de `user_metadata`: el usuario puede editar sus metadatos.

## Vista `public_profiles`
- Solo `id` y `full_name`, para mostrar nombres en cotizaciones y mensajes sin exponer correos ni roles.
- Las vistas no aplican RLS; por eso no puede tener más columnas. Solo la leen usuarios con sesión (`authenticated`).
- El Security Advisor la marca como `security_definer_view`: es intencional.

## Políticas RLS
RLS activado. Políticas, permisos y funciones de ayuda en `20261107_2038_profiles_rls.sql` (T0-05, #66).

Dos candados: los **permisos** (GRANT) dicen qué operaciones y columnas; las **políticas** (RLS) dicen qué filas. `anon` no tiene ningún permiso; `authenticated` tiene `SELECT` y `UPDATE (full_name)`.

| Operación | Quién | Condición |
|---|---|---|
| SELECT | Usuario | Solo su propio perfil; el admin ve todos. |
| INSERT | Nadie desde la app | Lo hace el trigger. |
| UPDATE | Usuario | Solo su `full_name` (permiso por columna). Nadie cambia su propio rol ni `is_suspended`. El cambio de rol por el admin lo agrega Iker en M7. |
| DELETE | Nadie en el MVP | — |

- [ ] Revisada por Iker con la checklist de RLS
- [x] Probada con dos cuentas de roles distintos

## Funciones de ayuda
- `public.get_my_role()`: rol del usuario actual; `null` sin sesión.
- `public.is_admin()`: `true` si el usuario actual es admin; si no, `false`.
- Las dos son `security definer` (leen `profiles` sin pasar por su RLS; si no, la política de SELECT entraría en recursión infinita) y tienen `search_path` fijo. Solo `authenticated` puede ejecutarlas. Uso en el README, sección «Base de datos».

## Pruebas en dev (7 nov 2026)
- Usuario creado desde el panel → perfil con el inicio del correo como nombre y rol `client`.
- Registro directo a la API pidiendo `role = admin` → perfil con rol `client`.

## Pruebas de RLS en dev (9 nov 2026)
Hechas en el SQL Editor fingiendo el token de cada usuario (`begin`, `set_config('request.jwt.claims', ...)`, `set local role authenticated`, consulta, `rollback`). El selector de rol ya no aparece en el editor.

| Prueba | Como | Resultado |
|---|---|---|
| Leer `profiles` | Hacker (client) | 1 fila: la suya ✅ |
| `update ... set role = 'admin'` en su fila | Hacker | `permission denied for table profiles` ✅ |
| `update ... set full_name` en su fila | Hacker | 1 fila actualizada ✅ |
| `update ... set full_name` en la fila de otro | Hacker | 0 filas ✅ |
| Leer `profiles` | diegodani2040 (admin) | 5 filas ✅ |
| Leer `profiles` | anon | `permission denied for table profiles` ✅ |

## Relaciones
- Apunta a `auth.users` (id).
- La usan [[requests]] (quién publica) y [[reports]] (quién reporta); [[businesses]] tiene un dueño que es un perfil. Ver [[Esquema de la base de datos]].

Volver a [[Esquema de la base de datos]]
