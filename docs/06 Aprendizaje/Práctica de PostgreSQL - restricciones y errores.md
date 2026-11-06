---
tags: [aprendizaje]
fecha: 2026-11-03
autor: Wilson
tema: supabase
---
# Práctica de PostgreSQL: restricciones y errores

**Qué pasó:** En `offero-dev` creé dos tablas de práctica, `practica_clientes` y `practica_pedidos`, con clave foránea y restricciones. Después intenté romper cada regla para leer el error que da PostgreSQL. Tarea T0-33 (#116).

| Código | Qué intenté | Regla que lo bloqueó |
|---|---|---|
| `23505` | Guardar un correo que ya existía | UNIQUE |
| `23502` | Guardar un cliente sin nombre | NOT NULL |
| `23514` | Guardar un pedido con cantidad 0 | CHECK (`practica_pedidos_cantidad_check`) |
| `23514` | Guardar el estado `perdido`, que no está en la lista | CHECK (`practica_pedidos_estado_check`) |
| `23503` | Crear un pedido de un cliente que no existe | Clave foránea |
| `23503` | Borrar un cliente que tenía pedidos, sin `on delete cascade` | Clave foránea |

**Por qué pasó:** Las restricciones son la última barrera: rechazan los datos malos aunque la app falle.

- La clave primaria identifica cada fila y no se repite. La clave foránea guarda el `id` de una fila de otra tabla y sí se puede repetir: `practica_pedidos.cliente_id` se conecta con `practica_clientes.id`.
- El código del error dice qué tipo de regla falló y el nombre de la restricción dice cuál. Por eso los dos CHECK dan el mismo código.
- Con `on delete cascade`, borrar un cliente también borra sus pedidos, sin preguntar.

**Cómo se resolvió:** Cada error se lee en orden: primero el código, luego el nombre de la restricción y al final el `DETAIL`, que muestra el dato que causó el problema. Con `join ... on c.id = p.cliente_id` consulté cada pedido con el nombre de su cliente. Al terminar borré las dos tablas y comprobé que ya no estaban en dev.

**Cómo evitarlo:**

- Revisar el nombre del proyecto antes de correr SQL: la etiqueta PRODUCTION aparece en la rama `main` de cualquier proyecto. Lo que importa es que diga `Offero-dev`.
- Al borrar tablas, empezar por la que tiene la clave foránea.
- En cada PR con SQL, pensar qué pasa al borrar (ON DELETE) antes de aprobar.

Relacionado: [[Aprendizaje MOC]]
