---
tags: [aprendizaje]
fecha:
autor: Diego
tema: Autenticación y roles
---
# Contrato de autenticación (sesión T1-03)

Guía de la sesión de 45 minutos con los cuatro (T1-03, #96). Sirve para dar la sesión y, después, como resumen para consultar. La referencia corta está en el README, sección **Autenticación**.

**Meta:** que cada uno sepa proteger una página y una Server Action, y usar `get_my_role()` en una política.

## Antes de la sesión (cada uno)
- [ ] `git checkout main`, `git pull origin main` y `npm install` dentro de `app-offero/`. Ya trae Next 16.4.6.
- [ ] `npm run dev` corriendo, y `localhost:3000` abre.
- [ ] Una cuenta de **cliente** y otra de **proveedor** en offero-dev. Se crean en `/registro`, con correos inventados.
- [ ] Una rama de práctica: `git switch -c practica/t1-03-tu-nombre`. **No se sube.**

## Agenda

| Min | Tema | Cómo |
|---|---|---|
| 0–10 | Obtener el usuario en el servidor | Explicación con `src/services/auth.js` |
| 10–20 | Proteger una página por rol | En vivo con `/perfil` |
| 20–30 | Proteger una Server Action | Ejemplo en el editor |
| 30–40 | `is_admin()` y `get_my_role()` en una política | SQL de `categories` y `requests` |
| 40–45 | Dudas y ejercicio | Cada uno protege una página de prueba |

## 1. Obtener el usuario (10 min)

Todo pasa por **un solo archivo**: `src/services/auth.js`. Nadie llama a `supabase.auth.getUser()` ni consulta `profiles` por su cuenta.

```js
import { obtenerUsuario } from "@/services/auth";

const usuario = await obtenerUsuario();
// null si no hay sesión, o:
// { id, email, nombre, role: "client" | "provider" | "admin", suspendido }
```

Puntos clave:
- **El rol sale de la tabla `profiles`**, nunca de `user_metadata`, porque el usuario puede editar sus metadatos.
- Usa `getUser()`, que valida la sesión con Supabase, y no `getSession()`, que confía en la cookie.
- `cache()` hace que, en una misma visita, el encabezado y la página consulten Supabase **una sola vez**.
- `import "server-only"`: si alguien lo importa en un componente `"use client"`, la compilación falla a propósito.

**Muéstralo en vivo:** `src/components/layout/Header.js` usa `obtenerUsuario()` para decidir si muestra "Hola, nombre" o "Iniciar sesión".

## 2. Proteger una página (10 min)

Una línea, **la primera** de la página:

```js
import { exigirUsuario } from "@/services/auth";

export default async function MiPagina() {
  const usuario = await exigirUsuario(["provider"]);   // o exigirUsuario() para cualquier rol
  // ...de aquí para abajo, el usuario ya está validado
}
```

| Caso | Qué pasa |
|---|---|
| Sin sesión | Va a `/login` |
| Cuenta suspendida | Va a `/login` |
| Con sesión pero sin el rol | Va a `/` |
| Con el rol correcto | Ve la página |

**En vivo:**
1. Abre `/perfil` sin sesión → te manda a `/login`.
2. Inicia sesión → ves tu nombre, correo y rol.
3. Cambia `/perfil` a `exigirUsuario(["admin"])` con la cuenta de cliente → te manda a `/`. **Deshaz el cambio.**

**Esconder el botón no protege nada:** cualquiera puede escribir la URL a mano. La revisión siempre va en la página, en el servidor.

## 3. Proteger una Server Action (10 min)

Una Server Action se puede llamar **sin pasar por la página**, así que cada una se revisa por sí sola. En las acciones no se redirige: se devuelve un error para que el formulario lo muestre.

```js
"use server";
import { usuarioConPermiso } from "@/services/auth";

export async function crearSolicitud(estadoAnterior, formData) {
  const usuario = await usuarioConPermiso(["client"]);
  if (!usuario) return { error: "No tienes permiso." };

  // validar los datos del formulario en el servidor...
  // guardar con el cliente de src/lib/supabase/server...
}
```

`usuarioConPermiso()` revisa tres cosas: que haya sesión, que la cuenta no esté suspendida y que tenga el rol. Si algo falla devuelve `null`.

**Ejemplo real:** `src/app/registro/actions.js` valida todo en el servidor y nunca muestra el error técnico de Supabase.

## 4. Roles en la base de datos (10 min)

RLS es **la última defensa**: aunque alguien olvide `exigirUsuario()`, la base no entrega datos ajenos. Las dos ayudas están en `20261107_2038_profiles_rls.sql`:

- `public.is_admin()`: `true` si quien pide es admin.
- `public.get_my_role()`: `'client'`, `'provider'` o `'admin'`.

**Ejemplo 1, `categories`** (solo el admin escribe):

```sql
create policy categories_insert_admin
  on public.categories
  for insert
  to authenticated
  with check ((select public.is_admin()));
```

**Ejemplo 2, `requests`** (solo un cliente crea, a su nombre y como abierta):

```sql
create policy requests_insert_client
  on public.requests
  for insert
  to authenticated
  with check (
    (select public.get_my_role()) = 'client'
    and client_id = (select auth.uid())
    and status = 'open'
  );
```

Tres reglas que siempre se cumplen:
1. **`to authenticated`** en toda política que use estas funciones. Sin eso, un visitante recibe `permission denied for function` en vez de `false`.
2. **Dentro de `(select ...)`**, igual que `(select auth.uid())`. Así Postgres las evalúa una vez por consulta y no una vez por fila.
3. **RLS controla filas, no columnas.** Para que nadie cambie un campo (dueño, rol, `is_hidden`) se usan permisos por columna: `revoke all` y después `grant update (columnas)`. Ver README, «Campos que el usuario no puede cambiar».

Para probar una política como un usuario, sigue [[Práctica de RLS - USING y WITH CHECK]] (`begin` … `rollback`). El SQL Editor corre como `postgres`, que se salta RLS.

## 5. Ejercicio (5 min, en la rama de práctica)

Cada uno protege la página que le va a tocar construir:

| Quién | Página de prueba | Línea |
|---|---|---|
| Daniel | `src/app/negocios/nuevo/page.js` | `await exigirUsuario(["provider"])` |
| Wilson | `src/app/solicitudes/nueva/page.js` | `await exigirUsuario(["client"])` |
| Iker | `src/app/administrador/page.js` | `await exigirUsuario(["admin"])` |

La página puede ser solo un `<h1>`. Pruébala con las dos cuentas: con la que tiene el rol se ve, y con la otra te manda a `/`.

## Cómo sabemos que quedó bien
- [ ] Cada uno protegió su página de prueba y la probó con dos cuentas.
- [ ] Cada uno puede explicar cuándo usar `exigirUsuario()` y cuándo `usuarioConPermiso()`.
- [ ] Cada uno puede escribir una política con `get_my_role()` y sabe por qué va `to authenticated`.

## Errores comunes
- Proteger solo escondiendo botones o enlaces.
- Usar `exigirUsuario()` dentro de una Server Action: redirige en vez de devolver un error al formulario.
- Leer el rol de `user.user_metadata`.
- Probar RLS como `postgres` y creer que funciona.
- Crear otro cliente de Supabase en vez de usar `src/lib/supabase/`.

## Acuerdos de la sesión
_(Llenar al terminar: fecha, quiénes estuvieron, dudas que salieron y lo que se decidió. Después, comentar en #96 el enlace a esta nota y las horas reales.)_

-

Volver a [[Aprendizaje MOC]] · [[M1 Autenticación y roles]]
