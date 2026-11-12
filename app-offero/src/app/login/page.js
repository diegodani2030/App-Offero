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
    </main>
  );
}