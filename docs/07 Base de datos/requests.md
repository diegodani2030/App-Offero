---
tags: [tabla]
responsable: Wilson
estado: propuesta
creada_en_dev:
creada_en_prod:
archivo_sql:
---
# Tabla `requests`

**Responsable:** Wilson · **Módulo:** [[M3 Solicitudes]]
Solicitudes de los clientes: qué necesitan, cuánto, dónde, para cuándo y de qué categoría.

> **Propuesta para la [[Sesión de diseño (T0-07)]].** Todavía no hay nada en Supabase: se crea en T1-11 (#104) con lo que se acuerde.

## Diagrama
```mermaid
erDiagram
  profiles ||--o{ requests : publica
  categories ||--o{ requests : clasifica
  requests ||--o{ quotes : recibe
  requests ||--o{ messages : contiene
  requests ||--o| reviews : genera
  requests {
    uuid id PK
    uuid client_id FK
    uuid category_id FK
    text title
    text description
    integer quantity
    text location
    date deadline
    text status
    boolean is_hidden
    timestamptz created_at
  }
```

## 1. Campos
| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | Clave primaria, automática (`gen_random_uuid()`). |
| client_id | uuid → `profiles.id` | Obligatorio. Por defecto `auth.uid()`: se llena solo con el usuario actual. |
| category_id | uuid → `categories.id` | Obligatorio. |
| title | text | Obligatorio, de 5 a 120 caracteres (CHECK). |
| description | text | Obligatorio, hasta 2000 caracteres (CHECK). |
| quantity | integer | Obligatorio, mayor que 0 (CHECK). |
| location | text | Obligatorio: ciudad y barrio. |
| deadline | date | Obligatorio. Solo fecha, sin hora. Que sea futura se valida en el servidor al crear. |
| status | text | `open`, `awarded` o `cancelled` (CHECK). Por defecto `open`. |
| is_hidden | boolean | Por defecto `false`. Solo lo cambia el admin. |
| created_at | timestamptz | Automático (`now()`). |

La fecha futura no va en un CHECK: el CHECK se revisa en cada `update`, y una solicitud vieja fallaría al cancelarla.

## 2. Claves foráneas
| Campo | Apunta a | Al borrar |
|---|---|---|
| client_id | `profiles.id` | `restrict`: no se puede borrar un perfil con solicitudes. |
| category_id | `categories.id` | `restrict`: no se puede borrar una categoría con solicitudes. |

No se borra nada ([[D-06 Claves foráneas, is_hidden y no borrar|D-06]]): una solicitud se cancela y el admin la oculta.

## 3. Estados
| De | A | Quién |
|---|---|---|
| — | `open` | El cliente, al crearla. |
| `open` | `cancelled` | El cliente dueño. |
| `open` | `awarded` | Solo la función de aceptar cotización de Diego (M4). Nadie lo pone a mano. |

`awarded` y `cancelled` son finales.

## 4. Permisos
Los dos candados, como en [[profiles]]: **permisos** (qué columnas) y **RLS** (qué filas).

**Permisos por columna:**
- `anon`: ninguno.
- `authenticated`: `select`; `insert (category_id, title, description, quantity, location, deadline)`; `update (category_id, title, description, quantity, location, deadline, status)`.
- Nadie puede escribir `client_id`, `is_hidden` ni `created_at`.

**Políticas RLS:**
| Operación | Quién | Condición |
|---|---|---|
| SELECT | Cliente | Las suyas: `client_id = (select auth.uid())`. |
| SELECT | Proveedor | Las `open` y no ocultas: `(select public.get_my_role()) = 'provider'`, `status = 'open'` y `is_hidden = false`. Cuando exista `quotes`, también las que cotizó. |
| SELECT | Admin | Todas: `(select public.is_admin())`. |
| INSERT | Cliente | `(select public.get_my_role()) = 'client'`, `client_id = (select auth.uid())` y `status = 'open'`. |
| UPDATE | Cliente dueño | `using`: es suya y está `open`. `with check`: sigue siendo suya y `status` es `open` o `cancelled`. Así no puede poner `awarded`. |
| DELETE | Nadie | Se cancela en vez de borrar. |

Todas las políticas van `to authenticated`.

## 5. Moderación
Lleva `is_hidden`. Una solicitud oculta deja de verla el proveedor; el cliente y el admin sí la siguen viendo. Ocultar lo hace el admin con una función propia en M7 (Iker).

## Para decidir en la sesión
1. ¿Se puede editar una solicitud que ya tiene cotizaciones? **Propuesta:** no, para que nadie cambie las condiciones después de que los proveedores cotizaron. Se aplica cuando exista `quotes`. Decide el PO (duda 3).
2. ¿Un visitante sin sesión (`anon`) ve las solicitudes abiertas? **Propuesta:** no en el MVP.
3. ¿Está bien `restrict` en las dos claves foráneas?
4. ¿Hace falta un índice? **Propuesta:** en `client_id`, `category_id` y `status`, porque las listas filtran por ellos.

- [ ] Revisada por Iker con la checklist de RLS
- [ ] Probada con dos cuentas de roles distintos

## Relaciones
- Apunta a [[profiles]] (`client_id`) y a [[categories]] (`category_id`).
- La usan [[quotes]] (`request_id`), [[messages]] (`request_id`) y [[reviews]] (una por solicitud adjudicada).
- Se puede reportar desde [[reports]] (`target_type = request`).

Volver a [[Esquema de la base de datos]]
