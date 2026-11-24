-- OFF-029 (#30) · Tabla quotes con RLS
-- Cotizaciones que un negocio envía a una solicitud. Cada proveedor ve solo las suyas
-- y el cliente ve todas las de sus solicitudes.
-- Depende de profiles (get_my_role(), is_admin()), requests (T1-11) y businesses (T1-08).
-- Se aplica primero en offero-dev. Nunca edites este archivo después de aplicarlo:
-- si hay que cambiar algo, crea uno nuevo.

-- 1. Tabla -------------------------------------------------------------------

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  -- Si algún día se borra la solicitud, se borran sus cotizaciones (hoy nadie borra, D-06).
  request_id uuid not null references public.requests (id) on delete cascade,
  -- No se puede borrar un negocio que tenga cotizaciones.
  business_id uuid not null references public.businesses (id) on delete restrict,
  -- numeric y no texto: así se ordena bien por precio (en pesos, con 2 decimales).
  price numeric(12, 2) not null check (price > 0),
  -- Plazo de entrega en días.
  delivery_time integer not null check (delivery_time > 0),
  conditions text check (char_length(conditions) <= 1000),
  -- Hasta qué día vale el precio. Que no sea pasada se valida en el servidor al crear:
  -- un CHECK se revisa en cada update y una cotización vieja fallaría al retirarla.
  valid_until date not null,
  -- pending: enviada · accepted / rejected: los pone la función de aceptar (OFF-033)
  -- withdrawn: el proveedor la retiró.
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  -- Un negocio cotiza una sola vez cada solicitud.
  unique (request_id, business_id)
);

-- RLS en el mismo archivo que crea la tabla. Sin políticas, nadie lee ni escribe desde la app.
alter table public.quotes enable row level security;

-- Índice para "las cotizaciones de mi negocio" (lo usan RLS y la app).
-- request_id ya tiene índice: es la primera columna del unique.
create index quotes_business_id_idx on public.quotes (business_id);

-- 2. Permisos de tabla -------------------------------------------------------
-- Supabase da todos los permisos a anon y authenticated por defecto; aquí se dejan solo los necesarios.
-- Permisos por columna (README, «Base de datos»): nadie escribe status al crear (sale 'pending'),
-- ni created_at; al editar, el proveedor solo puede tocar status (para retirarla).
revoke all on public.quotes from anon, authenticated;
grant select on public.quotes to authenticated;
grant insert (request_id, business_id, price, delivery_time, conditions, valid_until)
  on public.quotes to authenticated;
grant update (status) on public.quotes to authenticated;

-- 3. Políticas RLS -----------------------------------------------------------
-- Las subconsultas a businesses y requests pasan por el RLS de esas tablas, y ninguna
-- política de ellas consulta quotes, así que no hay recursión.

-- SELECT: el proveedor ve las cotizaciones de sus negocios.
create policy quotes_select_provider
  on public.quotes
  for select
  to authenticated
  using (exists (
    select 1 from public.businesses b
    where b.id = business_id and b.owner_id = (select auth.uid())
  ));

-- SELECT: el cliente ve todas las cotizaciones de sus solicitudes.
create policy quotes_select_client
  on public.quotes
  for select
  to authenticated
  using (exists (
    select 1 from public.requests r
    where r.id = request_id and r.client_id = (select auth.uid())
  ));

-- SELECT: el admin ve todas.
create policy quotes_select_admin
  on public.quotes
  for select
  to authenticated
  using ((select public.is_admin()));

-- INSERT: solo un proveedor, con un negocio suyo y no sancionado,
-- a una solicitud abierta y no oculta, y como pending.
create policy quotes_insert_provider
  on public.quotes
  for insert
  to authenticated
  with check (
    (select public.get_my_role()) = 'provider'
    and status = 'pending'
    and exists (
      select 1 from public.businesses b
      where b.id = business_id
        and b.owner_id = (select auth.uid())
        and b.admin_hidden_at is null
    )
    and exists (
      select 1 from public.requests r
      where r.id = request_id and r.status = 'open' and r.is_hidden = false
    )
  );

-- UPDATE: el proveedor solo puede retirar su cotización (pending → withdrawn).
-- El cliente no actualiza directo: acepta con la función de OFF-033, que cambia
-- la elegida a accepted, las demás a rejected y la solicitud a awarded a la vez.
create policy quotes_update_withdraw
  on public.quotes
  for update
  to authenticated
  using (
    status = 'pending'
    and exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = (select auth.uid())
    )
  )
  with check (
    status = 'withdrawn'
    and exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = (select auth.uid())
    )
  );

-- DELETE: sin política ni permiso. Una cotización no se borra: se retira (D-06).
