import "server-only";

import { createClient } from "@/lib/supabase/server";
import { obtenerUsuario } from "@/services/auth";

// Todas las consultas de la tabla requests pasan por aquí (M3 y M4).
// La seguridad la pone la base de datos (permisos por columna y RLS):
// estas funciones solo piden los datos y avisan si algo falla.
// Validar el formulario (largo del título, fecha futura...) va en la Server Action.

// Columnas que devuelve cada consulta, con la categoría ya unida.
const CAMPOS = `
  id,
  client_id,
  title,
  description,
  quantity,
  location,
  deadline,
  status,
  is_hidden,
  created_at,
  categoria:categories (id, code, name)
`;

// Pasa los nombres en español del formulario a las columnas de la tabla.
// Solo copia los campos que el usuario puede escribir: client_id, status,
// is_hidden y created_at nunca salen de aquí.
function aColumnas(datos) {
  const columnas = {};
  if (datos.categoriaId !== undefined) columnas.category_id = datos.categoriaId;
  if (datos.titulo !== undefined) columnas.title = datos.titulo;
  if (datos.descripcion !== undefined) columnas.description = datos.descripcion;
  if (datos.cantidad !== undefined) columnas.quantity = datos.cantidad;
  if (datos.ubicacion !== undefined) columnas.location = datos.ubicacion;
  if (datos.fechaLimite !== undefined) columnas.deadline = datos.fechaLimite;
  return columnas;
}

// Si Supabase devolvió un error, lo deja en la terminal y lanza uno en español.
function revisarError(error, mensaje) {
  if (!error) return;
  console.error(`requests: ${mensaje}`, error.code, error.message);
  throw new Error(mensaje);
}

// Cliente: sus solicitudes, de la más nueva a la más vieja.
export async function obtenerMisSolicitudes() {
  const usuario = await obtenerUsuario();
  if (!usuario) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select(CAMPOS)
    .eq("client_id", usuario.id)
    .order("created_at", { ascending: false });

  revisarError(error, "No se pudieron cargar tus solicitudes.");
  return data;
}

// Proveedor: las solicitudes abiertas, con filtro opcional por categoría.
// RLS ya deja ver solo las abiertas y no ocultas; el filtro lo hace explícito.
export async function obtenerSolicitudesAbiertas({ categoriaId } = {}) {
  const supabase = await createClient();
  let consulta = supabase
    .from("requests")
    .select(CAMPOS)
    .eq("status", "open")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  if (categoriaId) consulta = consulta.eq("category_id", categoriaId);

  const { data, error } = await consulta;
  revisarError(error, "No se pudieron cargar las solicitudes abiertas.");
  return data;
}

// Una solicitud por id. Devuelve null si no existe o si el usuario no la puede ver.
export async function obtenerSolicitud(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  revisarError(error, "No se pudo cargar la solicitud.");
  return data;
}

// Cliente: crea una solicitud. client_id y status los pone la base de datos.
export async function crearSolicitud(datos) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .insert(aColumnas(datos))
    .select(CAMPOS)
    .single();

  revisarError(error, "No se pudo crear la solicitud.");
  return data;
}

// Cliente dueño: edita una solicitud abierta.
// Si RLS no la deja (no es suya o ya no está abierta), no cambia ninguna fila.
export async function actualizarSolicitud(id, cambios) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .update(aColumnas(cambios))
    .eq("id", id)
    .select(CAMPOS)
    .maybeSingle();

  revisarError(error, "No se pudo actualizar la solicitud.");
  if (!data) throw new Error("No puedes editar esta solicitud.");
  return data;
}

// Cliente dueño: cancela una solicitud abierta. No se borra nunca (D-06).
export async function cancelarSolicitud(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select(CAMPOS)
    .maybeSingle();

  revisarError(error, "No se pudo cancelar la solicitud.");
  if (!data) throw new Error("No puedes cancelar esta solicitud.");
  return data;
}
