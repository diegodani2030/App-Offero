import "server-only";

import { createClient } from "@/lib/supabase/server";

// Todas las consultas de la tabla categories pasan por aquí (M2, M3 y M4).
// Cualquiera puede leer las categorías; solo el admin las cambia (RLS),
// y eso se hace desde el panel de Supabase, no desde la app.

const CAMPOS = "id, code, name, description";

// Si Supabase devolvió un error, lo deja en la terminal y lanza uno en español.
function revisarError(error, mensaje) {
  if (!error) return;
  console.error(`categories: ${mensaje}`, error.code, error.message);
  throw new Error(mensaje);
}

// Todas las categorías, en orden alfabético (para selectores y filtros).
export async function obtenerCategorias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CAMPOS)
    .order("name");

  revisarError(error, "No se pudieron cargar las categorías.");
  return data;
}

// Una categoría por su código (por ejemplo "Tec01"), para el filtro ?categoria= de /negocios.
// Devuelve null si no existe.
export async function obtenerCategoriaPorCodigo(codigo) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CAMPOS)
    .eq("code", codigo)
    .maybeSingle();

  revisarError(error, "No se pudo cargar la categoría.");
  return data;
}
