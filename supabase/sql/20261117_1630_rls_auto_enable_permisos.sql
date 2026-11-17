-- T2-14 (#173) · Quitar el permiso de ejecutar rls_auto_enable() desde la API
-- rls_auto_enable() es la función del event trigger ensure_rls, que activa RLS solo
-- en cada tabla nueva (D-04). No debe poder llamarse por /rest/v1/rpc/rls_auto_enable.
-- El event trigger sigue funcionando: Postgres no revisa este permiso al dispararlo.
-- Se aplica primero en offero-dev. Nunca edites este archivo después de aplicarlo.

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;