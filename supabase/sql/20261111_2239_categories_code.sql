-- T1-06 (#99) · Columna code en categories
-- Acordada en la sesión de diseño (T0-17): un código corto por categoría, por ejemplo Tec01.
-- Depende de 20261109_1521_categories.sql. Se aplica primero en offero-dev.
-- Nunca edites este archivo después de aplicarlo: si hay que cambiar algo, crea uno nuevo.

-- Formato: una mayúscula, dos minúsculas y dos números (Tec01, Hog02). Sin tildes ni ñ.
alter table public.categories
  add column code text not null unique
  check (code ~ '^[A-Z][a-z]{2}[0-9]{2}$');