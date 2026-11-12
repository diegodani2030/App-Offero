import Link from "next/link";
import MenuHamburguesa from "./MenuHamburguesa";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "@/app/login/actions";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nombre = null;
  if (user) {
    const { data: perfil } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    nombre = perfil?.full_name ?? user.email;
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#263049] bg-[#07090f]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-[1.8rem] font-extrabold text-white">
          Off<span className="text-blue-400">ero</span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 md:order-last">
            {user ? (
              <>
                <span className="hidden text-sm text-slate-400 sm:inline">Hola, {nombre}</span>
                <form action={cerrarSesion}>
                  <button
                    type="submit"
                    className="text-sm font-semibold text-slate-300 hover:text-white"
                  >
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          <MenuHamburguesa />
        </div>
      </nav>
    </header>
  );
}