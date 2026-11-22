-- T1-11 (#104) · Tabla requests con RLS
-- Depende de 20261107_2038_profiles_rls.sql (get_my_role(), is_admin()) y de 20261109_1521_categories.sql.
-- Se aplica primero en offero-dev. Nunca edites este archivo después de aplicarlo:
-- si hay que cambiar algo, crea uno nuevo.

-- 1. Tabla -------------------------------------------------------------------

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  -- Se llena solo con el usuario actual. No se puede borrar un perfil con solicitudes (D-06).
  client_id uuid not null default auth.uid()
    references public.profiles (id) on delete restrict,
  -- No se puede borrar una categoría que tenga solicitudes.
  category_id uuid not null
    references public.categories (id) on delete restrict,
  title text not null check (char_length(title) between 5 and 120),
  description text not null check (char_length(description) between 10 and 2000),
  quantity integer not null check (quantity > 0),
  location text not null check (char_length(location) between 2 and 200),
  -- Solo fecha, sin hora ni zona horaria. Que sea futura se valida en el servidor al crear:
  -- un CHECK se revisa en cada update y una solicitud vieja fallaría al cancelarla.
  deadline date not null,
  status text not null default 'open' check (status in ('open', 'awarded', 'cancelled')),
  -- Solo lo cambia el admin (M7, Iker). El dueño no tiene permiso sobre esta columna.
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS en el mismo archivo que crea la tabla. Sin políticas, nadie lee ni escribe desde la app.
alter table public.requests enable row level security;

-- Índices: las listas filtran por dueño, categoría y estado, y las políticas usan client_id.
create index requests_client_id_idx on public.requests (client_id);
create index requests_category_id_idx on public.requests (category_id);
create index requests_status_idx on public.requests (status);

-- 2. Permisos de tabla ------------------------------------------------------------
-- Supabase da todos los permisos a anon y authenticated por defecto; aquí se dejan solo los necesarios.
-- Mecanismo para campos protegidos: permisos por columna (ver README, «Base de datos»).
-- Nadie escribe client_id (sale de auth.uid()), is_hidden ni created_at.
revoke all on public.requests from anon, authenticated;
grant select on public.requests to authenticated;
grant insert (category_id, title, description, quantity, location, deadline)
  on public.requests to authenticated;
grant update (category_id, title, description, quantity, location, deadline, status)
  on public.requests to authenticated;

-- 3. Políticas RLS ------------------------------------------------------------------

-- SELECT: el cliente ve todas las suyas (también las ocultas).
create policy requests_select_own
  on public.requests
  for select
  to authenticated
  using (client_id = (select auth.uid()));

-- SELECT: el proveedor ve las abiertas que no están ocultas.
-- Cuando exista quotes, también las que cotizó (se ajusta con Diego en el Sprint 3).
create policy requests_select_provider_open
  on public.requests
  for select
  to authenticated
  using (
    (select public.get_my_role()) = 'provider'
    and status = 'open'
    and is_hidden = false
  );

-- SELECT: el admin ve todas.
create policy requests_select_admin
  on public.requests
  for select
  to authenticated
  using ((select public.is_admin()));

-- INSERT: solo un cliente, a su nombre y como abierta.
create policy requests_insert_client
  on public.requests
  for insert
  to authenticated
  with check (
    (select public.get_my_role()) = 'client'
    and client_id = (select auth.uid())
    and status = 'open'
  );

-- UPDATE: solo el dueño y solo mientras está abierta.
-- with check: puede dejarla abierta o cancelarla, pero nunca ponerla en awarded
-- (eso lo hace la función de aceptar cotización de Diego en M4).
create policy requests_update_own_open
  on public.requests
  for update
  to authenticated
  using (client_id = (select auth.uid()) and status = 'open')
  with check (client_id = (select auth.uid()) and status in ('open', 'cancelled'));

-- DELETE: sin política. Una solicitud no se borra: se cancela (D-06).
