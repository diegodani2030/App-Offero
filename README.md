# Offero

Offero es una plataforma web que conecta a personas y empresas que necesitan productos o servicios con negocios y proveedores que pueden ofrecerlos. Los compradores publican solicitudes y reciben cotizaciones que pueden comparar según precio, tiempo de entrega y condiciones.

Stack: Next.js (App Router, JavaScript) · React · Tailwind CSS · Supabase · Vercel.

## Requisitos

- Windows 10 u 11 con PowerShell y Visual Studio Code.
- Node.js LTS: `winget install OpenJS.NodeJS.LTS`
- Git: `winget install Git.Git`
- Permitir scripts de npm (una sola vez): `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Después de instalar Node y Git, cierra y vuelve a abrir PowerShell.

## Instalación en Windows

1. Clona el repositorio **fuera de OneDrive** (por ejemplo en `C:\dev`):

   ```powershell
   mkdir C:\dev
   cd C:\dev
   git clone https://github.com/diegodani2030/App-Offero.git
   ```

2. Entra a la carpeta del proyecto e instala las dependencias. Todos los comandos `npm` se ejecutan dentro de `app-offero`:

   ```powershell
   cd C:\dev\App-Offero\app-offero
   npm install
   ```

3. Crea tu archivo de variables de entorno a partir del ejemplo:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Abre `.env.local` y llena los valores que Diego te envía por mensaje privado. Este archivo nunca se sube a GitHub.

4. Corre la aplicación y abre http://localhost:3000 en el navegador:

   ```powershell
   npm run dev
   ```

## Estructura del repositorio

- `app-offero/`: el proyecto de Next.js. Las páginas están en `src/app/` (cada carpeta es una ruta) y los componentes en `src/components/`.
  - `src/lib/supabase/`: la única forma de conectarse a Supabase. **Nadie crea otro cliente de Supabase; usa los de `src/lib/supabase/`**:
    - En páginas, layouts, Server Actions y Route Handlers: `import { createClient } from "@/lib/supabase/server"` y `const supabase = await createClient();`.
    - En componentes con `"use client"`: `import { createClient } from "@/lib/supabase/client"` y `const supabase = createClient();`.
    - Solo se usa la clave publishable. La clave secreta (`service_role`) nunca va en el código.
  - `src/proxy.js`: corre antes de cada petición y renueva la sesión. No revisa permisos: eso se hace en cada página o acción y en RLS.
- `docs/`: la bóveda de Obsidian con la documentación del equipo.
- `supabase/sql/`: los cambios de la base de datos, un archivo por cambio (se crea con la primera tabla).
- `.github/`: plantillas de pull requests e issues.

## Base de datos

Cada cambio es un archivo en `supabase/sql/` con nombre `AAAAMMDD_HHMM_descripcion.sql`. Se aplica una sola vez, primero en offero-dev y antes de fusionar en offero-prod. Si algo cambia, se crea un archivo nuevo.

### Funciones de ayuda

Úsalas en tus políticas en vez de consultar `profiles` otra vez.

- `public.is_admin()`: devuelve `true` si quien hace la petición es admin. Úsala cuando el admin pueda hacer algo que los demás no, por ejemplo ver todos los reportes o un negocio oculto: `for select to authenticated using (... or (select public.is_admin()))`.
- `public.get_my_role()`: devuelve `'client'`, `'provider'` o `'admin'`. Úsala cuando la regla dependa del rol, por ejemplo que solo un proveedor pueda enviar cotizaciones: `for insert to authenticated with check ((select public.get_my_role()) = 'provider')`.

Estas funciones no están disponibles para `anon` (visitantes sin sesión). Escribe siempre `to authenticated` en toda política que las llame: sin eso, una petición sin sesión falla con `permission denied for function` en vez de devolver `false`.

Escríbelas dentro de `(select ...)`, igual que `(select auth.uid())`: así PostgreSQL las evalúa una vez por consulta y no una vez por fila.

### Campos que el usuario no puede cambiar

Mecanismo elegido: **permisos por columna**. Se quita el permiso de actualizar toda la tabla y se da solo sobre las columnas editables:

```sql
revoke all on public.mi_tabla from anon, authenticated;
grant select on public.mi_tabla to authenticated;
grant update (columna_editable_1, columna_editable_2) on public.mi_tabla to authenticated;
-- Si la app crea o borra filas en esa tabla, da también insert o delete (con su política).
-- Sin ese grant, la app falla con permission denied aunque exista la política.
```

Así nadie cambia su propio `role` en `profiles`, ni `owner_id`, `client_id` o `is_hidden` en las demás tablas, aunque tenga una política de UPDATE. Un cambio en una columna protegida falla con `permission denied`. Lo que solo puede cambiar el admin (como `is_hidden` o el rol) se hace con una función propia, revisada por Iker.

Los permisos se leen siempre de `profiles.role`, nunca de los metadatos del usuario (`user_metadata`): el usuario puede editarlos.

### Cómo probar las políticas

El SQL Editor corre como `postgres`, que se salta RLS: una consulta normal ahí no prueba nada. Finge ser un usuario dentro de una transacción que se deshace al final:

```sql
begin;
-- Finge el token del usuario (cambia el nombre por el de tu usuario de prueba).
select set_config('request.jwt.claims', json_build_object('sub', (select id from public.profiles where full_name = 'Hacker'), 'role', 'authenticated')::text, true);
set local role authenticated;   -- para un visitante sin sesión: set local role anon;
select * from public.mi_tabla;  -- la consulta que quieres probar
rollback;                       -- nada de lo anterior se guarda
```

Prueba siempre en offero-dev y con dos usuarios de roles distintos. Si un `update` o `delete` no devuelve filas, el editor muestra el resultado anterior: envuélvelo así para ver cuántas filas cambió: `with x as (update ... returning id) select count(*) from x;`.

## Cómo trabajamos

1. Toma una tarea del tablero y muévela a «En curso».
2. Actualiza `main` y crea tu rama: `git switch main`, `git pull`, `git switch -c tipo/mN-descripcion` (tipos: `feat`, `fix`, `chore`, `docs`).
3. Haz commits pequeños con el formato `tipo(módulo): qué hace`.
4. Sube tu rama con `git push -u origin nombre-de-tu-rama` y abre un pull request hacia `main` usando la plantilla. Escribe «Cierra #N» para enlazar la tarea.
5. Un compañero revisa y Diego fusiona.

Nunca hagas commits directos a `main` ni subas `.env.local`, `node_modules` o claves.

Más detalles en [Cómo usar esta bóveda](<docs/Cómo usar esta bóveda.md>).