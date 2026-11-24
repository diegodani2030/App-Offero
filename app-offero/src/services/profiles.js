import "server-only";

import { createClient } from "@/lib/supabase/server";
import { obtenerUsuario } from "@/services/auth";

// Consultas de la tabla profiles que no son de sesión (las de sesión están en auth.js).
// La seguridad la pone la base de datos: el usuario solo tiene permiso de cambiar
// full_name (permiso por columna) y solo en su propia fila (RLS). El rol no se puede tocar.

// Cambia el nombre del usuario actual. Devuelve el nombre guardado.
export async function actualizarMiNombre(nombre) {
  const usuario = await obtenerUsuario();
  if (!usuario) throw new Error("Inicia sesión para editar tu perfil.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: nombre })
    .eq("id", usuario.id)
    .select("full_name")
    .maybeSingle();

  if (error) {
    console.error("profiles: no se pudo actualizar el nombre", error.code, error.message);
    throw new Error("No se pudo guardar tu nombre.");
  }
  if (!data) throw new Error("No se pudo guardar tu nombre.");
  return data.full_name;
}
