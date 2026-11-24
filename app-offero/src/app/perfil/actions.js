"use server";

import { revalidatePath } from "next/cache";
import { usuarioConPermiso } from "@/services/auth";
import { actualizarMiNombre } from "@/services/profiles";

// Server Action del formulario de nombre en /perfil (OFF-011, #12).
// Solo cambia full_name: el rol no viaja en el formulario y la base no deja cambiarlo
// (permiso por columna de profiles, T0-05).
// Devuelve { error, valor } si algo falla o { exito } cuando se guardó.
export async function guardarNombre(estadoAnterior, formData) {
  // Cualquier usuario con sesión y no suspendido puede editar su propio nombre.
  const usuario = await usuarioConPermiso();
  if (!usuario) return { error: "Inicia sesión para editar tu perfil." };

  // Quita espacios al inicio y al final, y deja uno solo entre palabras.
  const nombre = String(formData.get("nombre") ?? "").trim().replace(/\s+/g, " ");

  // Mismos límites que el CHECK de profiles.full_name.
  if (nombre.length < 2 || nombre.length > 100) {
    return { error: "El nombre debe tener entre 2 y 100 caracteres.", valor: nombre };
  }

  try {
    await actualizarMiNombre(nombre);
  } catch {
    // El detalle técnico queda en la terminal (profiles.js); al usuario un mensaje claro.
    return { error: "No pudimos guardar tu nombre. Inténtalo de nuevo.", valor: nombre };
  }

  // El nombre sale en /perfil y en el saludo del encabezado: se refresca todo el sitio.
  revalidatePath("/", "layout");
  return { exito: "Nombre guardado." };
}
