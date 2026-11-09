-- T0-05 (#66) · Funciones is_admin() y get_my_role(), permisos y políticas RLS de profiles
-- Depende de 20261107_1634_profiles.sql. Se aplica primero en offero-dev.
-- Nunca edites este archivo después de aplicarlo: si hay que cambiar algo, crea uno nuevo.

-- 1. Funciones de ayuda --------------------------------------------------------
-- Las usa todo el equipo en sus políticas en vez de repetir la consulta a profiles.
-- Leen profiles con permisos de su dueño (security definer) para no depender del RLS de profiles.

-- Rol del usuario actual ('client', 'provider' o 'admin'); null si no hay sesión.
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

-- true si el usuario actual es admin; false en cualquier otro caso (también sin sesión).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = (select auth.uid())),
    false
  );
$$;

-- Solo usuarios con sesión pueden llamarlas.
revoke execute on function public.get_my_role() from public, anon;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- 2. Permisos de tabla ------------------------------------------------------------
-- Supabase da todos los permisos a anon y authenticated por defecto; aquí se dejan solo los necesarios.
-- Mecanismo elegido para campos protegidos: permisos por columna (ver README, «Base de datos»).
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
-- Solo full_name se puede actualizar: nadie cambia su propio id, email, role ni is_suspended.
grant update (full_name) on public.profiles to authenticated;

-- 3. Políticas RLS ------------------------------------------------------------------

-- SELECT: cada uno ve su perfil; el admin ve todos.
create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

-- UPDATE: cada uno solo su propio perfil (y solo full_name, por los permisos de arriba).
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- INSERT: sin política. Lo hace el trigger handle_new_user().
-- DELETE: sin política. En el MVP nadie borra perfiles.
