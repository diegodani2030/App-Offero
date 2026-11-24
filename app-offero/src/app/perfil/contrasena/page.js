import Link from "next/link";
import { exigirUsuario } from "@/services/auth";
import FormularioContrasena from "@/components/perfil/FormularioContrasena";
import { cambiarContrasena } from "./actions";

export const metadata = {
  title: "Cambiar contraseña · Offero",
};

export default async function PaginaCambiarContrasena() {
  // Cualquier usuario con sesión.
  await exigirUsuario();

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Cambiar contraseña</h1>
      <p className="mt-2 text-slate-400">Elige una contraseña que no uses en otras páginas.</p>
      <FormularioContrasena accion={cambiarContrasena} />
      <p className="mt-6 text-sm">
        <Link href="/perfil" className="font-semibold text-blue-400 hover:underline">
          ← Volver a mi perfil
        </Link>
      </p>
    </main>
  );
}
