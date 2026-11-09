---
tags: [tecnico, seguridad]
responsable: Iker
---
# Checklist de revisión de RLS

Úsala en **cada PR que crea o cambia una tabla o vista**. Copia las casillas en tu comentario del PR y márcalas. Si una no se cumple, escribe por qué.

## Tabla
- [ ] RLS activada **en el mismo archivo** que crea la tabla.
- [ ] Hay política para **SELECT, INSERT, UPDATE y DELETE**, o una razón escrita si alguna no hace falta.
- [ ] Nada abierto a `anon` sin una razón escrita.
- [ ] INSERT y UPDATE llevan **WITH CHECK** (UPDATE lleva también USING).
- [ ] Columnas sensibles protegidas con **permisos por columna** (`grant update (col) ...`): `owner_id`, `client_id`, `is_hidden`, `role`, `status`.
- [ ] Usa `is_admin()` y `get_my_role()` (dentro de `(select ...)` y con `to authenticated`), no repite consultas a `profiles`.
- [ ] Los permisos salen de `profiles.role`, nunca de `user_metadata`.

## Vistas
- [ ] Las vistas **no aplican RLS**: solo llevan las columnas que puede ver cualquiera (nunca `email` ni `*`).

## App
- [ ] La clave secreta (`service_role`) **nunca** está en el frontend ni en el repo.

## Cómo probar
El SQL Editor corre como `postgres`, que **se salta RLS**: así la prueba no cuenta. Finge ser un usuario dentro de una transacción que se deshace:

```sql
begin;
select set_config('request.jwt.claims', json_build_object('sub', (select id from public.profiles where full_name = 'Hacker'), 'role', 'authenticated')::text, true);
set local role authenticated;   -- visitante: set local role anon; (sin set_config)
select count(*) from public.mi_tabla;   -- la consulta a probar
rollback;
```

1. Prueba con **dos cuentas de roles distintos** (por ejemplo, client y admin) y con un **visitante** (`anon`).
2. Intenta romperlo: ver filas de otro, crear a nombre de otro, cambiar una columna protegida.
3. Anota en el PR una tabla con **prueba, esperado y resultado**.

**Cómo leer los resultados:**
- `0 filas` sin error → RLS filtró. Si esperabas filas, **falta la política de SELECT**.
- `42501 permission denied for table` → lo frenó el permiso (GRANT).
- `42501 violates row-level security policy` → lo frenó RLS (WITH CHECK).
- `23514` → lo frenó un CHECK de la tabla.
- Usa `count(*)`: si la consulta devuelve 0 filas, el editor muestra el resultado anterior.

Ver también [[Práctica de RLS - USING y WITH CHECK]] y el README, sección «Base de datos».

Volver a [[Esquema de la base de datos]]