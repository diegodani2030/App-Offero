import Link from "next/link";
import FormularioLogin from "./FormularioLogin";

export const metadata = {
  title: "Iniciar sesión · Offero",
};

export default function PaginaLogin() {
  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Iniciar sesión</h1>
      <p className="mt-2 text-gray-500">Entra con el correo con el que te registraste.</p>
      <FormularioLogin />
      <p className="mt-6 text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-blue-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}