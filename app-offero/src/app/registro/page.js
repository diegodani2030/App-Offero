import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerUsuario } from "@/services/auth";
import FormularioRegistro from "./FormularioRegistro";

export const metadata = {
  title: "Crear cuenta · Offero",
};

export default async function PaginaRegistro() {
  if (await obtenerUsuario()) redirect("/perfil");

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
      <p className="mt-2 text-gray-500">Es gratis y toma un minuto.</p>
      <FormularioRegistro />
      <p className="mt-6 text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-blue-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}