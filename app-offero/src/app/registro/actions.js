"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const ROLES_PERMITIDOS = ["client", "provider"];
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registrarse(estadoAnterior, formData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const contrasena = String(formData.get("contrasena") ?? "");
  const rol = String(formData.get("rol") ?? "");

  const valores = { nombre, correo, rol };

  if (nombre.length < 2 || nombre.length > 100) {
    return { error: "El nombre debe tener entre 2 y 100 caracteres.", ...valores };
  }
  if (!CORREO_VALIDO.test(correo)) {
    return { error: "Escribe un correo válido.", ...valores };
  }
  if (contrasena.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres.", ...valores };
  }
  if (!ROLES_PERMITIDOS.includes(rol)) {
    return { error: "Elige si eres cliente o proveedor.", ...valores };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: { data: { full_name: nombre, role: rol } },
  });

  if (error) {
    return {
      error: "No pudimos crear la cuenta. Si ya tienes una, inicia sesión.",
      ...valores,
    };
  }

  if (!data.session) {
    return { exito: "Revisa tu correo para confirmar la cuenta." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}