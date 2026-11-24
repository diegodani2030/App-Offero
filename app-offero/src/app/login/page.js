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
      {/* OFF-063 · Durante el piloto no hay correo de recuperación (D-09, D-14):
          el equipo restablece la contraseña a mano. Ver docs, «Recuperar el acceso a una cuenta». */}
      <p className="mt-6 text-sm text-gray-500">
        ¿Olvidaste tu contraseña? Escríbele al equipo de Offero por el mismo canal por el que te
        invitamos al piloto y te ayudamos a entrar el mismo día.
      </p>
      <p className="mt-3 text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-blue-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}