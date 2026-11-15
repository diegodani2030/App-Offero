import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const obtenerUsuario = cache(async () => {
  const supabase = await createClient();

  const { data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil, error } = await supabase
    .from("profiles")
    .select("full_name, role, is_suspended")
    .eq("id", user.id)
    .single();
  if (error) console.error("obtenerUsuario: no se pudo leer profiles:", error.message);
  if (!perfil) return null;

  return {
    id: user.id,
    email: user.email,
    nombre: perfil.full_name ?? user.email,
    role: perfil.role,
    suspendido: perfil.is_suspended,
  };
});

export async function exigirUsuario(rolesPermitidos) {
  const usuario = await obtenerUsuario();

  if (!usuario || usuario.suspendido) redirect("/login");

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) {
    redirect("/");
  }

  return usuario;
}

// Para Server Actions: devuelve el usuario si puede actuar, o null si no.
// No redirige: la acción decide qué error devolver al formulario.
export async function usuarioConPermiso(rolesPermitidos) {
  const usuario = await obtenerUsuario();
  if (!usuario || usuario.suspendido) return null;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) return null;
  return usuario;
}