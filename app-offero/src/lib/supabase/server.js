import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente de Supabase para el servidor: páginas, layouts, Server Actions y Route Handlers.
// Crea uno nuevo en cada petición (nunca lo guardes en una variable global):
// cada petición trae las cookies de un usuario distinto.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        // Lee la sesión desde las cookies de la petición.
        getAll() {
          return cookieStore.getAll();
        },
        // Guarda la sesión nueva cuando Supabase la renueva.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Un Server Component no puede escribir cookies. No pasa nada:
            // src/proxy.js renueva la sesión en cada petición.
          }
        },
      },
    },
  );
}
