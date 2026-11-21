"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { usuarioConPermiso } from "@/services/auth";
import { crearSolicitud } from "@/services/requests";
import { leerFormularioSolicitud, validarSolicitud } from "@/lib/validarSolicitud";

// Server Action del formulario de nueva solicitud (OFF-023, #24).
// Devuelve { errores, valores } para que RequestForm muestre cada error junto a su campo,
// o { error } para un problema general. client_id y status los pone la base de datos.
export async function publicarSolicitud(estadoAnterior, formData) {
  // Cada Server Action se revisa por sí sola (README, «Autenticación»).
  const usuario = await usuarioConPermiso(["client"]);
  if (!usuario) return { error: "Solo los clientes pueden publicar solicitudes." };

  const valores = leerFormularioSolicitud(formData);
  const { datos, errores } = validarSolicitud(valores);

  // La categoría tiene que existir (el formato ya se revisó arriba).
  if (!errores.categoria) {
    const supabase = await createClient();
    const { data: categoria, error } = await supabase
      .from("categories")
      .select("id")
      .eq("id", datos.categoriaId)
      .maybeSingle();
    if (error) console.error("publicarSolicitud: no se pudo revisar la categoría:", error.message);
    if (!categoria) errores.categoria = "Esa categoría no existe. Elige otra.";
  }

  if (Object.keys(errores).length > 0) {
    return { errores, valores };
  }

  let creada;
  try {
    creada = await crearSolicitud(datos);
  } catch {
    // El detalle técnico queda en la terminal (requests.js); al usuario un mensaje claro.
    return { error: "No pudimos publicar tu solicitud. Inténtalo de nuevo.", valores };
  }

  revalidatePath("/solicitudes", "layout");
  // Todavía no existen el detalle (OFF-026) ni «Mis solicitudes»: por ahora se vuelve
  // al formulario con un aviso. Cuando existan, se redirige allá.
  redirect(`/solicitudes/nueva?creada=${creada.id}`);
}
