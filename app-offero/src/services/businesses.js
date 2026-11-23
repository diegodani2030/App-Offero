import "server-only";

import { createClient } from "@/lib/supabase/server";
import { obtenerUsuario } from "@/services/auth";

// Todas las consultas de negocios pasan por aquí (M2 y M4).
// Tablas: businesses, business_categories (varias categorías por negocio, D-13)
// y business_contacts (el WhatsApp, que solo ve el dueño, D-11).
// La seguridad la pone la base de datos (permisos por columna y RLS):
// estas funciones solo piden los datos y avisan si algo falla.
// Validar el formulario (largos, categorías que existan...) va en la Server Action.

// Columnas que devuelve cada consulta, con las categorías ya unidas.
// Supabase pasa por business_categories para traer las categorías de cada negocio.
const CAMPOS = `
  id,
  owner_id,
  name,
  description,
  location,
  is_hidden,
  admin_hidden_at,
  created_at,
  categorias:categories (id, code, name)
`;

// Pasa los nombres en español del formulario a las columnas de businesses.
// Solo copia lo que el usuario puede escribir: owner_id, is_hidden,
// admin_hidden_at y created_at nunca salen de aquí.
function aColumnas(datos) {
  const columnas = {};
  if (datos.nombre !== undefined) columnas.name = datos.nombre;
  if (datos.descripcion !== undefined) columnas.description = datos.descripcion;
  if (datos.ubicacion !== undefined) columnas.location = datos.ubicacion;
  return columnas;
}

// Si Supabase devolvió un error, lo deja en la terminal y lanza uno en español.
function revisarError(error, mensaje) {
  if (!error) return;
  console.error(`businesses: ${mensaje}`, error.code, error.message);
  throw new Error(mensaje);
}

// Guarda las categorías de un negocio: borra las que tenía y pone las nuevas.
// RLS solo deja hacerlo al dueño del negocio.
async function guardarCategorias(supabase, negocioId, categoriaIds) {
  const { error: errorBorrar } = await supabase
    .from("business_categories")
    .delete()
    .eq("business_id", negocioId);
  revisarError(errorBorrar, "No se pudieron cambiar las categorías del negocio.");

  if (categoriaIds.length === 0) return;

  const filas = categoriaIds.map((categoriaId) => ({
    business_id: negocioId,
    category_id: categoriaId,
  }));
  const { error } = await supabase.from("business_categories").insert(filas);
  revisarError(error, "No se pudieron guardar las categorías del negocio.");
}

// Guarda el WhatsApp de un negocio: lo actualiza si ya existe y, si no, lo crea.
// No se usa upsert porque el dueño no tiene permiso de cambiar business_id.
async function guardarWhatsapp(supabase, negocioId, whatsapp) {
  const { data, error } = await supabase
    .from("business_contacts")
    .update({ whatsapp })
    .eq("business_id", negocioId)
    .select("business_id");
  revisarError(error, "No se pudo actualizar el WhatsApp del negocio.");
  if (data.length > 0) return;

  const { error: errorCrear } = await supabase
    .from("business_contacts")
    .insert({ business_id: negocioId, whatsapp });
  revisarError(errorCrear, "No se pudo guardar el WhatsApp del negocio.");
}

// Lista pública: los negocios visibles, del más nuevo al más viejo,
// con filtro opcional por categoría (el id de la categoría).
export async function obtenerNegocios({ categoriaId } = {}) {
  const supabase = await createClient();

  // Con filtro, se une business_categories con !inner: así solo quedan los negocios
  // que tienen esa categoría, y "categorias" sigue trayendo todas las del negocio.
  const campos = categoriaId
    ? `${CAMPOS}, filtro:business_categories!inner (category_id)`
    : CAMPOS;

  // RLS ya esconde los ocultos a los demás; el filtro lo hace explícito
  // para que el dueño tampoco vea los suyos ocultos en la lista pública.
  let consulta = supabase
    .from("businesses")
    .select(campos)
    .eq("is_hidden", false)
    .is("admin_hidden_at", null)
    .order("created_at", { ascending: false });

  if (categoriaId) consulta = consulta.eq("filtro.category_id", categoriaId);

  const { data, error } = await consulta;
  revisarError(error, "No se pudieron cargar los negocios.");

  // Quita la columna auxiliar del filtro para que no llegue a los componentes.
  return data.map(({ filtro, ...negocio }) => negocio);
}

// Un negocio por id. Devuelve null si no existe, si el id no es válido
// o si el usuario no lo puede ver (por ejemplo, porque está oculto).
export async function obtenerNegocio(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  // 22P02 = el texto no tiene forma de uuid (alguien escribió mal la URL): es un "no existe".
  if (error?.code === "22P02") return null;
  revisarError(error, "No se pudo cargar el negocio.");
  return data;
}

// El negocio del usuario actual, con su WhatsApp. Lo usan «Mi negocio» (M2) y M4.
// Devuelve null si no hay sesión o si el usuario todavía no tiene negocio.
// La base de datos permite varios negocios por proveedor (D-13), pero por ahora
// la app maneja uno: se devuelve el primero que creó.
export async function obtenerMiNegocio() {
  const usuario = await obtenerUsuario();
  if (!usuario) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(`${CAMPOS}, contacto:business_contacts (whatsapp)`)
    .eq("owner_id", usuario.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  revisarError(error, "No se pudo cargar tu negocio.");
  return data;
}

// Proveedor: crea su negocio con sus categorías y, si lo da, su WhatsApp.
// datos = { nombre, descripcion, ubicacion, categoriaIds: [...], whatsapp }
// owner_id lo pone el servidor con el usuario de la sesión, nunca el formulario.
// Devuelve { id } del negocio nuevo. Para mostrarlo, la Server Action hace
// revalidatePath y la página lo vuelve a leer: si se leyera aquí mismo durante
// el render de una página, Next podría devolver una lectura anterior guardada.
export async function crearNegocio(datos) {
  const usuario = await obtenerUsuario();
  if (!usuario) throw new Error("Inicia sesión para crear tu negocio.");

  const supabase = await createClient();
  const { data: negocio, error } = await supabase
    .from("businesses")
    .insert({ ...aColumnas(datos), owner_id: usuario.id })
    .select("id")
    .single();
  revisarError(error, "No se pudo crear el negocio.");

  // Son tres tablas y Supabase no las guarda en un solo paso: si algo falla aquí,
  // el negocio ya existe y el dueño puede completar los datos al editarlo.
  await guardarCategorias(supabase, negocio.id, datos.categoriaIds ?? []);
  if (datos.whatsapp) await guardarWhatsapp(supabase, negocio.id, datos.whatsapp);

  return { id: negocio.id };
}

// Dueño: edita su negocio. Solo cambia lo que venga en "cambios".
// cambios = { nombre?, descripcion?, ubicacion?, categoriaIds?, whatsapp? }
// Si RLS no lo deja (no es suyo), no cambia ninguna fila y se avisa.
// Devuelve { id }, igual que crearNegocio (mismo motivo).
export async function actualizarNegocio(id, cambios) {
  const usuario = await obtenerUsuario();
  if (!usuario) throw new Error("Inicia sesión para editar tu negocio.");

  const supabase = await createClient();

  // Primero confirma que el negocio es del usuario. RLS lo bloquearía igual,
  // pero en business_categories un borrado ajeno no da error: solo no borra nada.
  const { data: propio, error: errorDueno } = await supabase
    .from("businesses")
    .select("id")
    .eq("id", id)
    .eq("owner_id", usuario.id)
    .maybeSingle();
  if (errorDueno?.code === "22P02") throw new Error("No puedes editar este negocio.");
  revisarError(errorDueno, "No se pudo revisar el negocio.");
  if (!propio) throw new Error("No puedes editar este negocio.");

  const columnas = aColumnas(cambios);

  if (Object.keys(columnas).length > 0) {
    const { data, error } = await supabase
      .from("businesses")
      .update(columnas)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    revisarError(error, "No se pudo actualizar el negocio.");
    if (!data) throw new Error("No puedes editar este negocio.");
  }

  if (cambios.categoriaIds !== undefined) {
    await guardarCategorias(supabase, id, cambios.categoriaIds);
  }
  if (cambios.whatsapp !== undefined) {
    await guardarWhatsapp(supabase, id, cambios.whatsapp);
  }

  return { id };
}
