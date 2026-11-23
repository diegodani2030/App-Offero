"use server";

import { revalidatePath } from "next/cache";
import { usuarioConPermiso } from "@/services/auth";
import { obtenerCategorias } from "@/services/categories";
import { obtenerMiNegocio, crearNegocio, actualizarNegocio } from "@/services/businesses";
import { leerFormularioNegocio, validarNegocio } from "@/lib/validarNegocio";

// Server Action del formulario «Mi negocio» (OFF-015 crear y OFF-016 editar).
// Devuelve { errores, valores } para que BusinessForm muestre cada error junto a su campo,
// { error } para un problema general, o { exito } cuando se guardó.
export async function guardarNegocio(estadoAnterior, formData) {
  // Cada Server Action se revisa por sí sola (README, «Autenticación»):
  // proteger la página no basta, porque una acción se puede llamar directo.
  const usuario = await usuarioConPermiso(["provider"]);
  if (!usuario) return { error: "Solo los proveedores pueden crear o editar su negocio." };

  const valores = leerFormularioNegocio(formData);

  let categoriasValidas;
  try {
    categoriasValidas = (await obtenerCategorias()).map((c) => c.id);
  } catch {
    return { error: "No pudimos revisar las categorías. Inténtalo de nuevo.", valores };
  }

  const { datos, errores } = validarNegocio(valores, categoriasValidas);
  if (Object.keys(errores).length > 0) {
    return { errores, valores };
  }

  // El negocio a editar se busca con la sesión, nunca con un id del formulario:
  // así nadie puede editar el de otro cambiando el id en la petición.
  let creado = false;
  try {
    const miNegocio = await obtenerMiNegocio();
    if (miNegocio) {
      await actualizarNegocio(miNegocio.id, datos);
    } else {
      await crearNegocio(datos);
      creado = true;
    }
  } catch {
    // El detalle técnico queda en la terminal (businesses.js); al usuario un mensaje claro.
    return { error: "No pudimos guardar tu negocio. Inténtalo de nuevo.", valores };
  }

  // La página vuelve a leer el negocio y el formulario se llena con lo guardado.
  // También se refresca la lista pública de negocios (/negocios, cuando exista).
  revalidatePath("/negocios", "layout");
  return {
    exito: creado
      ? "¡Listo! Tu negocio quedó creado y los clientes ya lo pueden ver."
      : "Cambios guardados.",
  };
}
