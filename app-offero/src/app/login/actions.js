"use server";

import { createClient} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function iniciarSesion(estadoAnterior, formData) {
    const correo = String(formData.get("correo") ?? "").trim();
    const contrasena = String(formData.get("contrasena") ?? "");

    if (!correo || !contrasena) {
        return {
            error: "Por favor, ingresa tu correo y contraseña.", correo
        };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena,
    });

    if (error) {
        return {
            error: "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.",
            correo
        };
    }
    revalidatePath("/", "layout");
    redirect("/");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}