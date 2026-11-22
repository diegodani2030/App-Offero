-- T1-06 (#99) · Tabla categories con RLS
-- Depende de 20261107_2038_profiles_rls.sql (usa la función is_admin()).
-- Se aplica primero en offero-dev. Nunca edites este archivo después de aplicarlo:
-- si hay que cambiar algo, crea uno nuevo.

-- 1. Tabla -------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 60),
  description text,
  created_at timestamptz not null default now()
);

-- RLS en el mismo archivo que crea la tabla. Sin políticas, nadie lee ni escribe desde la app.
alter table public.categories enable row level security;

-- 2. Permisos de tabla ------------------------------------------------------------
-- Supabase da todos los permisos a anon y authenticated por defecto; aquí se dejan solo los necesarios.
revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

-- 3. Políticas RLS ------------------------------------------------------------------

-- SELECT: todos pueden ver las categorías, incluso sin sesión.
create policy categories_select_all
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- INSERT, UPDATE y DELETE: solo el admin (la pantalla la construye Iker en M7).
create policy categories_insert_admin
  on public.categories
  for insert
  to authenticated
  with check ((select public.is_admin()));

create policy categories_update_admin
  on public.categories
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy categories_delete_admin
  on public.categories
  for delete
  to authenticated
  using ((select public.is_admin()));