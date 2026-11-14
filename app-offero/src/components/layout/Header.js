import Link from "next/link";
import MenuHamburguesa from "./MenuHamburguesa";
import { obtenerUsuario } from "@/services/auth";
import { cerrarSesion } from "@/app/login/actions";

export default async function Header() {
  const usuario = await obtenerUsuario();

  return (
    <header className="sticky top-0 z-10 border-b border-[#263049] bg-[#07090f]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-[1.8rem] font-extrabold text-white">
          Off<span className="text-blue-400">ero</span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 md:order-last">
            {usuario ? (
              <>
                <span className="hidden text-sm text-slate-400 sm:inline">Hola, {usuario.nombre}</span>
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