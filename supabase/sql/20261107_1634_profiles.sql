-- T0-04 (#65) · Tabla profiles, trigger de registro y vista public_profiles
-- Se aplica primero en offero-dev. Las políticas y las funciones de ayuda van en T0-05 (#66), en otro archivo.
-- Nunca edites este archivo después de aplicarlo: si hay que cambiar algo, crea uno nuevo.

-- 1. Tabla -------------------------------------------------------------------

create table public.profiles (
  -- Mismo id que el usuario de Auth; si se borra el usuario, se borra su perfil.
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  -- Copia informativa: nunca se muestra a otros usuarios.
  email text,
  role text not null default 'client' check (role in ('client', 'provider', 'admin')),
  -- Lo usa Iker en M7 (suspender cuentas). Va desde ya para no modificar la tabla después.
  is_suspended boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS en el mismo archivo que crea la tabla. Sin políticas, nadie lee ni escribe desde la app.
alter table public.profiles enable row level security;

-- 2. Creación automática del perfil -------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
-- Corre con permisos de su dueño para poder insertar aunque RLS bloquee al usuario.
security definer
-- Sin search_path implícito: cada objeto se nombra con su esquema (public., auth.).
set search_path = ''
as $$
declare
  v_role text := new.raw_user_meta_data ->> 'role';
  v_name text := btrim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
begin
  -- Solo client o provider desde el registro. Si llega admin u otra cosa, queda client.
  if v_role is null or v_role not in ('client', 'provider') then
    v_role := 'client';
  end if;

  -- Sin nombre (por ejemplo, usuario creado desde el panel): se usa el inicio del correo.
  if char_length(v_name) < 2 then
    v_name := split_part(coalesce(new.email, ''), '@', 1);
  end if;
  if char_length(v_name) < 2 then
    v_name := 'Usuario';
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (new.id, left(v_name, 100), new.email, v_role);

  return new;
end;
$$;

-- Nadie la llama desde la app; solo el trigger.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Vista pública de nombres ---------------------------------------------------

-- Las vistas no aplican el RLS de la tabla: por eso solo lleva id y full_name.
-- Sirve para mostrar nombres en cotizaciones y mensajes sin exponer correos ni roles.
create view public.public_profiles as
  select id, full_name
  from public.profiles;

-- Solo usuarios con sesión pueden leer nombres.
revoke all on public.public_profiles from anon, authenticated;
grant select on public.public_profiles to authenticated;
