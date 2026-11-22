-- T1-07 (#100) · Categorías iniciales (lista provisional del PO, 12 nov 2026)
-- Depende de 20261109_1521_categories.sql y 20261111_2239_categories_code.sql.
-- Se aplica primero en offero-dev. Nunca edites este archivo después de aplicarlo:
-- si hay que cambiar algo, crea uno nuevo.

insert into public.categories (code, name, description) values
  ('Tec01', 'Tecnología', 'Computadores, celulares, accesorios, páginas web, soporte técnico y reparación de equipos.'),
  ('Hog01', 'Hogar y reparaciones', 'Plomería, electricidad, pintura, cerrajería y arreglos locativos.'),
  ('Con01', 'Construcción y remodelación', 'Obras, remodelaciones, materiales y acabados.'),
  ('Eve01', 'Eventos', 'Alquiler de mobiliario, sonido, decoración y fotografía para eventos.'),
  ('Ali01', 'Alimentos y bebidas', 'Refrigerios, almuerzos para empresas, catering y bebidas.'),
  ('Dis01', 'Diseño e impresión', 'Diseño gráfico, impresión, pendones, tarjetas y material publicitario.'),
  ('Ofi01', 'Oficina y papelería', 'Útiles, papelería, insumos y muebles de oficina.'),
  ('Ase01', 'Aseo y limpieza', 'Limpieza de oficinas y hogares, y productos de aseo.'),
  ('Tra01', 'Transporte y mudanzas', 'Mudanzas, acarreos, mensajería y envíos dentro de Bogotá.'),
  ('Dot01', 'Dotación y uniformes', 'Uniformes, dotación de trabajo, ropa corporativa y bordados.'),
  ('Bel01', 'Belleza y cuidado personal', 'Peluquería, barbería, manicure, maquillaje y estética, en local o a domicilio.'),
  ('Otr01', 'Otros', 'Lo que no encaja en ninguna otra categoría. Se revisa con las entrevistas para crear categorías nuevas.');