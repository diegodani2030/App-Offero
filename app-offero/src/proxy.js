import { updateSession } from "@/lib/supabase/session";

// En Next.js 16 el antiguo middleware se llama proxy: corre antes de cada petición.
// Aquí solo renueva la sesión de Supabase. Los permisos se revisan en cada página,
// Server Action y en RLS, nunca solo aquí.
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  // Corre en todas las rutas menos archivos estáticos e imágenes.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
