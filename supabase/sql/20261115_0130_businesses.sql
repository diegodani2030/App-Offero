-- T1-08 (#101) · Tablas businesses, business_categories y business_contacts con RLS
-- Acordado en la sesión de diseño (T0-17): un proveedor puede tener varios negocios
-- y un negocio varias categorías. El WhatsApp va en tabla aparte por D-11.
-- Depende de profiles (T0-04/T0-05) y categories (T1-06). Se aplica primero en offero-dev.
-- Nunca edites este archivo después de aplicarlo: si hay que cambiar algo, crea uno nuevo.

-- 1. Tabla businesses ---------------------------------------------------------

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  -- Dueño del negocio. No es único: un proveedor puede tener varios negocios.
  owner_id uuid not null references public.profiles (id) on delete restrict,
  name text not null check (char_length(name) between 2 and 100),
  description text not null check (char_length(description) between 1 and 1000),
  -- Ciudad y barrio (Bogotá en el piloto).
  location text not null check (char_length(location) between 2 and 100),
  -- El dueño lo oculta o lo vuelve a mostrar.
  is_hidden boolean not null default false,
  -- Fecha en que el admin lo ocultó por una sanción. Vacío = no está sancionado.
  -- Lo cambia el admin con una función propia (M7, Iker), no desde la app.
  admin_hidden_at timestamptz,
  created_at timestamptz not null default now()
);

-- Índice para buscar rápido los negocios de un dueño (lo usan RLS y la app).
create index businesses_owner_id_idx on public.businesses (owner_id);

alter table public.businesses enable row level security;

-- Permisos por columna (README, «Campos que el usuario no puede cambiar»):
-- al crear o editar, nadie toca owner_id después de creado ni admin_hidden_at.
revoke all on public.businesses from anon, authenticated;
grant select on public.businesses to anon, authenticated;
grant insert (owner_id, name, description, location, is_hidden) on public.businesses to authenticated;
grant update (name, description, location, is_hidden) on public.businesses to authenticated;
-- Sin grant de delete: nadie borra negocios por ahora (D-06, pendiente con el equipo).

-- Políticas de businesses -----------------------------------------------------

-- SELECT visitante: solo los negocios visibles.
create policy businesses_select_anon
  on public.businesses
  for select
  to anon
  using (not is_hidden and admin_hidden_at is null);

-- SELECT con sesión: los visibles, más los propios y todos si es admin.
create policy businesses_select_authenticated
  on public.businesses
  for select
  to authenticated
  using (
    (not is_hidden and admin_hidden_at is null)
    or owner_id = (select auth.uid())
    or (select public.is_admin())
  );

-- INSERT: solo un proveedor, y solo a su nombre.
create policy businesses_insert_provider
  on public.businesses
  for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and (select public.get_my_role()) = 'provider'
  );

-- UPDATE: solo el dueño (y solo las columnas del grant de arriba).
create policy businesses_update_owner
  on public.businesses
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

-- 2. Tabla business_categories ------------------------------------------------
-- Un negocio puede tener varias categorías: una fila por cada pareja negocio-categoría.

create table public.business_categories (
  business_id uuid not null references public.businesses (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  -- Los dos juntos son la clave: un negocio no repite la misma categoría.
  primary key (business_id, category_id)
);

alter table public.business_categories enable row level security;

revoke all on public.business_categories from anon, authenticated;
grant select on public.business_categories to anon, authenticated;
grant insert, delete on public.business_categories to authenticated;

-- SELECT: se ven las categorías de los negocios que el usuario puede ver.
-- La subconsulta pasa por el RLS de businesses, así los ocultos no se ven.
create policy business_categories_select
  on public.business_categories
  for select
  to anon, authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id));

-- INSERT y DELETE: solo el dueño del negocio agrega o quita sus categorías.
create policy business_categories_insert_owner
  on public.business_categories
  for insert
  to authenticated
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));

create policy business_categories_delete_owner
  on public.business_categories
  for delete
  to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));

-- Índice para filtrar negocios por categoría (el listado de M2 lo usa).
create index business_categories_category_id_idx on public.business_categories (category_id);

-- 3. Tabla business_contacts (D-11) ------------------------------------------
-- El WhatsApp no va en businesses porque esa tabla la puede leer cualquiera.
-- Por ahora solo lo ve el dueño. La política del cliente que elige una cotización
-- se agrega en OFF-062 (Sprint 4), cuando existan quotes y requests.

create table public.business_contacts (
  business_id uuid primary key references public.businesses (id) on delete cascade,
  -- Celular colombiano: 10 dígitos y empieza por 3.
  whatsapp text not null check (whatsapp ~ '^3[0-9]{9}$')
);

alter table public.business_contacts enable row level security;

revoke all on public.business_contacts from anon, authenticated;
grant select, insert on public.business_contacts to authenticated;
grant update (whatsapp) on public.business_contacts to authenticated;

-- SELECT, INSERT y UPDATE: solo el dueño del negocio.
create policy business_contacts_select_owner
  on public.business_contacts
  for select
  to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));

create policy business_contacts_insert_owner
  on public.business_contacts
  for insert
  to authenticated
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));

create policy business_contacts_update_owner
  on public.business_contacts
  for update
  to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));