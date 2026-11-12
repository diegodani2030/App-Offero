import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para el navegador: úsalo en componentes con "use client".
// Usa solo la clave publishable; la protección real de los datos la da RLS.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
