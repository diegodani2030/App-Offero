import { exigirUsuario } from "@/services/auth";
import { obtenerCategorias } from "@/services/categories";
import { obtenerMiNegocio } from "@/services/businesses";
import { MAXIMO_CATEGORIAS } from "@/lib/validarNegocio";
import BusinessForm from "@/components/businesses/BusinessForm";
import { guardarNegocio } from "./actions";

export const metadata = {
  title: "Mi negocio · Offero",
};

export default async function PaginaMiNegocio() {
  // Solo los proveedores tienen negocio (README, «Autenticación»).
  // Sin sesión va a /login; con otro rol, a la portada.
  await exigirUsuario(["provider"]);

  const [categorias, negocio] = await Promise.all([obtenerCategorias(), obtenerMiNegocio()]);

  // "Otros" (código Otr..) va al final: es la opción de "ninguna de las anteriores".
  const ordenadas = [...categorias].sort(
    (a, b) => Number(a.code.startsWith("Otr")) - Number(b.code.startsWith("Otr")),
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        {negocio ? "Mi negocio" : "Crea el perfil de tu negocio"}
      </h1>
      <p className="mt-2 text-slate-400">
        {negocio
          ? "Mantén tus datos al día para que los clientes te conozcan."
          : "Cuéntales a los clientes de Bogotá qué haces para que te encuentren."}
      </p>
      {negocio?.is_hidden && (
        <p className="mt-6 rounded-md border border-amber-700 bg-amber-950 p-3 text-sm text-amber-200">
          Tu negocio está oculto: los clientes no lo ven en la lista.
        </p>
      )}
      <BusinessForm
        accion={guardarNegocio}
        categorias={ordenadas}
        negocio={negocio}
        maximoCategorias={MAXIMO_CATEGORIAS}
      />
    </main>
  );
}
