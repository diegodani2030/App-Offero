---
tags: [aprendizaje]
fecha: 2026-11-09
autor: Iker
tema: - Supabase y RLS: [[Práctica de PostgreSQL - restricciones y errores]], [[Práctica de RLS - USING y WITH CHECK]]
---
# Práctica de RLS: USING y WITH CHECK

**Qué pasó:** En `offero-dev` creé la tabla de práctica `practica_notas` (id, owner_id con clave foránea a `profiles`, texto y created_at) y activé RLS. Le puse dos políticas: SELECT (cada uno ve solo sus notas) e INSERT (solo puedes crear notas a tu nombre). Creé una nota como Hacker y otra como Wilson Hacker, y después intenté romper las reglas. Tarea T0-30 (#91).

| Prueba | Como | Esperado | Resultado |
|---|---|---|---|
| Leer las notas | Hacker | Solo sus notas | ✅ Solo las suyas; la de Wilson no aparece |
| Crear una nota a nombre de Wilson | Hacker | Error | ✅ `42501 new row violates row-level security policy` |
| Leer las notas | anon | 0 filas | ✅ 0 filas, sin error |
| Leer las notas sin política de SELECT | Hacker | 0 filas | ✅ `count(*)` = 0, sin error, aunque tenía 2 notas |

**Por qué pasó:**
- **USING** decide qué filas que **ya existen** puedes ver o tocar. Se usa en SELECT, UPDATE y DELETE. Por eso Hacker no vio la nota de Wilson: existe en la tabla, pero no cumple `owner_id = auth.uid()`.
- **WITH CHECK** revisa la fila **nueva** que intentas guardar. Se usa en INSERT y UPDATE. Por eso Hacker no pudo crear una nota con el id de Wilson como dueño: la fila nueva no cumple `owner_id = auth.uid()`.
- En UPDATE se usan los dos: USING elige qué fila puedes cambiar y WITH CHECK revisa cómo queda.
- **Tabla vacía sin error:** con RLS activado, si ninguna política te deja ver una fila, Postgres simplemente no la muestra. No da error, solo filtra. Por eso `anon` (ninguna política es para él) y Hacker sin la política de SELECT vieron 0 filas.
- El dueño lo decide `auth.uid()`, que sale del token de la sesión, no de lo que escribe el usuario. Escribir "Wilson" en el texto no cambia de quién es la nota.

**Cómo se resolvió:** El SQL Editor corre como `postgres`, que se salta RLS. Para probar como un usuario usé una transacción que se deshace:

    begin;
    select set_config('request.jwt.claims', json_build_object('sub', (select id from public.profiles where full_name = 'Hacker'), 'role', 'authenticated')::text, true);
    set local role authenticated;   -- para un visitante: set local role anon;
    select ...;                     -- la consulta que quiero probar
    rollback;                       -- no se guarda nada

Cuando una consulta devuelve 0 filas, el editor muestra el resultado anterior (por ejemplo, el del `set_config`). Para ver el número real usé `select count(*) ...`, que siempre devuelve una fila. Al terminar borré la tabla de práctica y comprobé que en `public` solo quedaba `profiles`.

**Cómo evitarlo:**
- **No probar como `postgres`.** Me pasó dos veces: pegué solo la consulta, sin `begin` ni `set local role`, y vi todas las filas (y una nota falsa se guardó de verdad). Antes de pulsar Run, revisar que la primera línea sea `begin;` y la última `rollback;`.
- **Si una página sale vacía y sin error**, lo primero es revisar si la tabla tiene política de SELECT para ese rol.
- Leer el mensaje del `42501`: `permission denied for table` lo frena el permiso (GRANT); `violates row-level security policy` lo frena RLS.
- Con `commit`, cada Run guarda una fila nueva. Para probar, usar siempre `rollback`.
