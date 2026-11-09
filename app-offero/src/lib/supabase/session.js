import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// La llama src/proxy.js antes de cada petición: renueva la sesión si el token
// está por vencer y deja las cookies nuevas en el navegador y en la petición.
export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // 1. En la petición: así la página que viene ya ve la sesión nueva.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          // 2. En la respuesta: así el navegador guarda la sesión nueva.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // 3. Encabezados anti-caché: una respuesta con la sesión de un
          //    usuario nunca debe guardarse y entregarse a otro.
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // No pongas código entre createServerClient y getClaims():
  // getClaims() valida el token y lo renueva si hace falta.
  await supabase.auth.getClaims();

  return response;
}
