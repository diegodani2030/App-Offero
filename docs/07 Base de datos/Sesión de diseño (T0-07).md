---
tags: [reunion, tecnico]
fecha:
asistentes: [Diego, Wilson, Daniel, Iker]
issue: "#68"
---
# Sesión de diseño de la base de datos (T0-07)

**Facilitan:** Diego (tiempo y agenda) y Wilson (convenciones y notas) · **Duración:** 2 h
**Objetivo:** salir con los campos y permisos de las 8 tablas acordados, antes de que cada uno escriba su SQL.

## Antes de la sesión (cada uno)
1. Lee [[Esquema de la base de datos]] y la nota de **tus** tablas.
2. Trae una propuesta de tus tablas con las 5 preguntas de abajo. Puede ser en papel o directamente en la nota.

| Quién | Tablas |
|---|---|
| Diego | [[profiles]] (ya creada), [[quotes]] |
| Daniel | [[categories]], [[businesses]] |
| Wilson | [[requests]], [[messages]] |
| Iker | [[reports]], [[reviews]] |

## Agenda
| Tiempo | Qué | Quién |
|---|---|---|
| 15 min | Convenciones (Anexo D): nombres, tipos, claves foráneas, `is_hidden` y no borrar ([[D-06 Claves foráneas, is_hidden y no borrar\|D-06]]), RLS en el mismo archivo, permisos por columna, `is_admin()` y `get_my_role()` | Wilson |
| 60 min | Tabla por tabla, unos 7 min cada una, en el orden de creación | El dueño presenta; Iker pregunta por permisos |
| 20 min | Dudas abiertas | Todos |
| 15 min | Acuerdos, responsables y fechas | Diego |

Fuera del MVP (no se diseña hoy): pagos, varias ciudades, notificaciones por correo.

## Las 5 preguntas de cada tabla
1. **Campos:** nombre, tipo, si es obligatorio y sus reglas (`check`).
2. **Claves foráneas:** a qué tabla apunta cada `_id`. No se borra: se cancela u oculta (D-06).
3. **Estados:** qué valores tiene `status` y quién pasa de uno a otro.
4. **Permisos:** quién ve, crea, edita (qué columnas) y borra. Visitante sin sesión (`anon`), cliente, proveedor y admin.
5. **Moderación:** ¿lleva `is_hidden`?

## Guía por tabla
Preguntas para arrancar; las respuestas van en la nota de cada tabla.

1. **[[profiles]]** (Diego, 5 min): mostrar cómo quedó. Ya tiene `is_suspended`; ver la duda 1.
2. **[[categories]]** (Daniel): ¿quién crea y edita? (solo admin). ¿La ve un visitante sin sesión? Ojo: `is_admin()` no funciona para `anon`, así que la política de lectura pública va aparte.
3. **[[requests]]** (Wilson): campos (título, descripción, `category_id`, `client_id`, fecha límite, `status`…). ¿Qué proveedores ven las solicitudes abiertas? ¿Se edita con cotizaciones? (duda 3). Cancelar en vez de borrar.
4. **[[businesses]]** (Daniel): un negocio por proveedor (`owner_id` único). ¿Lo ve un visitante sin sesión? ¿Lleva `is_hidden`?
5. **[[reports]]** (Iker): `target_type` + `target_id` (no puede ser clave foránea porque apunta a tres tablas). ¿Quién ve un reporte? (quien lo creó y el admin). Solo el admin cambia el `status`.
6. **[[quotes]]** (Diego): `request_id`, `business_id`, precio, plazo, condiciones, vigencia y `status`. ¿Una cotización por negocio y solicitud? ¿Quién la ve? (el cliente de la solicitud y el dueño del negocio). Aceptar una cambia las demás a la vez (OFF-033). Ver la duda 4.
7. **[[messages]]** (Wilson): solo el cliente de la solicitud y los proveedores que la cotizaron ([[D-07 Quién puede enviar mensajes|D-07]]). ¿Se pueden editar o borrar?
8. **[[reviews]]** (Iker): una por solicitud, del cliente que aceptó una cotización ([[D-08 Reglas contra reseñas falsas|D-08]]). Calificación de 1 a 5 (`check`). La vista del promedio no tiene RLS: la revisan Wilson e Iker.

## Dudas abiertas (deben salir resueltas)
| # | Duda | Decisión | Responsable | Fecha |
|---|---|---|---|---|
| 1 | `is_suspended` en profiles: ¿qué le bloquea a un usuario suspendido y quién lo suspende? | | | |
| 2 | ¿Quién escribe la política de admin en categories? | | | |
| 3 | ¿Se puede editar una solicitud que ya tiene cotizaciones? | | | |
| 4 | Estados de quotes: ¿quién pasa de `pending` a `accepted`, `rejected` o `withdrawn`? | | | |

## Acuerdos
Escritos después de la sesión (T1-40, #171). Lo marcado como **pendiente** se está confirmando con el equipo; no se crea el SQL de una tabla hasta que su parte esté confirmada.

### Por tabla
- **[[profiles]]:** ya creada; sin cambios.
- **[[categories]]:** cada categoría tendrá un **código** para diferenciar los nichos. El código combina letras mayúsculas y minúsculas con números (por ejemplo, `Tec01` o `Hog02`) y debe cumplir unas reglas de formato para que la categoría sea válida. **Pendiente:** Daniel define el formato exacto.
- **[[requests]]:** el título y la descripción tendrán un mínimo y un máximo de caracteres. Habrá un sistema de búsqueda que ayude a los proveedores a encontrar los pedidos.
- **[[businesses]]:** si un proveedor sancionado no resuelve su sanción en el plazo dado, su negocio queda oculto (`is_hidden`).
- **[[reports]]:** una persona solo puede reportar una vez el mismo caso. Los reportes sirven para suspender al proveedor y tener más control sobre lo que se dice.
- **[[reviews]]:** calificación de 1 a 5 con su comentario.
- **[[quotes]]:** sin acuerdos todavía.
- **[[messages]]:** habrá un control del lenguaje en el chat para evitar lenguaje inapropiado; a quien lo use se le puede dar una advertencia o limitarle los mensajes. **Pendiente:** cómo se reporta, quién decide la sanción y cuánto dura. Como M5 quedó P1 ([[D-11 Contacto entre cliente y proveedor|D-11]]), se define antes de crear `messages`.

### Otros
- **D-06, D-07 y D-08:** **pendiente** confirmar si pasan de «Propuesta» a «Tomada».

## Decisiones nuevas
Cada decisión nueva va como nota en `03 Decisiones` con la plantilla «Decisión» (D-11 en adelante) y se enlaza aquí.

## Al terminar
- [ ] Cada tabla tiene campos y permisos en su nota.
- [ ] Las dudas abiertas están resueltas o tienen responsable y fecha.
- [ ] Diego comenta los acuerdos y las horas reales en el issue #68 y lo cierra.

Volver a [[Esquema de la base de datos]]
