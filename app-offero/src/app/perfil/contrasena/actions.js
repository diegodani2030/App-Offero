"use server";

import { createClient } from "@/lib/supabase/server";
import { usuarioConPermiso } from "@/services/auth";

// Server Action para cambiar la contraseña (OFF-063, #175).
// La usa quien recibió una contraseña temporal del admin (ver docs, «Recuperar el acceso
// a una cuenta») y cualquiera que quiera cambiar la suya.
// Devuelve { errores } con un error por campo, { error } general o { exito }.
// Nunca devuelve las contraseñas: si algo falla, el usuario las vuelve a escribir.
export async function cambiarContrasena(estadoAnterior, formData) {
  const usuario = await usuarioConPermiso();
  if (!usuario) return { error: "Inicia sesión para cambiar tu contraseña." };

  const actual = String(formData.get("actual") ?? "");
  const nueva = String(formData.get("nueva") ?? "");
  const confirmacion = String(formData.get("confirmacion") ?? "");

  const errores = {};
  if (!actual) errores.actual = "Escribe tu contraseña actual.";
  // 8 como en el registro; 72 es el máximo que guarda bcrypt (lo usa Supabase).
  if (nueva.length < 8 || nueva.length > 72) {
    errores.nueva = "La contraseña nueva debe tener entre 8 y 72 caracteres.";
  } else if (nueva === actual) {
    errores.nueva = "La contraseña nueva debe ser distinta de la actual.";
  }
  if (confirmacion !== nueva) errores.confirmacion = "Las dos contraseñas no coinciden.";
  if (Object.keys(errores).length > 0) return { errores };

  const supabase = await createClient();

  // Se pide la actual para que nadie cambie la contraseña con una sesión abierta ajena
  // (un computador compartido, por ejemplo). Supabase la revisa iniciando sesión otra vez.
  const { error: errorActual } = await supabase.auth.signInWithPassword({
    email: usuario.email,
    password: actual,
  });
  if (errorActual) return { errores: { actual: "La contraseña actual no es correcta." } };

  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (error) {
    console.error("cambiarContrasena:", error.code, error.message);
    // Supabase rechaza contraseñas muy débiles o filtradas con weak_password.
    if (error.code === "weak_password") {
      return { errores: { nueva: "Esa contraseña es muy fácil de adivinar. Elige otra." } };
    }
    return { error: "No pudimos cambiar tu contraseña. Inténtalo de nuevo." };
  }

  return { exito: "Listo, tu contraseña quedó cambiada." };
}
