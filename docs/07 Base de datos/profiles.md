---
tags: [tabla]
responsable: Diego
creada_en_dev: 2026-11-07
creada_en_prod:
archivo_sql: supabase/sql/20261107_1634_profiles.sql
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
RLS activado. Las políticas van en T0-05 (#66), en otro archivo. Hasta entonces, nadie lee ni escribe desde la app.

| Operación | Quién | Condición |
|---|---|---|
| SELECT | Usuario | Solo su propio perfil; el admin ve todos. |
| INSERT | Nadie desde la app | Lo hace el trigger. |
| UPDATE | Usuario | Solo su `full_name` (permiso por columna). Nadie cambia su propio rol ni `is_suspended`. El cambio de rol por el admin lo agrega Iker en M7. |
| DELETE | Nadie en el MVP | — |

- [ ] Revisada por Iker con la checklist de RLS
- [ ] Probada con dos cuentas de roles distintos

## Pruebas en dev (7 nov 2026)
- Usuario creado desde el panel → perfil con el inicio del correo como nombre y rol `client`.
- Registro directo a la API pidiendo `role = admin` → perfil con rol `client`.

## Relaciones
- Apunta a `auth.users` (id).
- La usan [[requests]] (quién publica) y [[reports]] (quién reporta); [[businesses]] tiene un dueño que es un perfil. Ver [[Esquema de la base de datos]].

Volver a [[Esquema de la base de datos]]
