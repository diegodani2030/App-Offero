import Link from "next/link";
import { Suspense } from "react";
import ListaUsuarios from "./ListaUsuarios";
import SolicitudesDesdeCliente from "./SolicitudesDesdeCliente";

export const metadata = {
  title: "API demo · Práctica",
};

// Next 4: la página no espera a la API. Suspense muestra «Cargando…» mientras
// ListaUsuarios trae los datos, y luego lo cambia por la lista (streaming).
// Con ?roto=1 la API falla y se ve error.js.
export default async function PaginaApiDemo({ searchParams }) {
  const { roto } = await searchParams;

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Usuarios de una API pública (servidor)</h1>
        <p className="mt-1 text-sm text-gray-500">
          jsonplaceholder.typicode.com ·{" "}
          {roto ? (
            <Link href="/practica/wilson/api-demo" className="text-blue-600 hover:underline">
              volver a la URL buena
            </Link>
          ) : (
            <Link href="/practica/wilson/api-demo?roto=1" className="text-blue-600 hover:underline">
              probar con una URL rota
            </Link>
          )}
        </p>
        <div className="mt-4">
          <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
            <ListaUsuarios roto={Boolean(roto)} />
          </Suspense>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Mis solicitudes desde mi API (cliente)</h2>
        <p className="mt-1 text-sm text-gray-500">fetch a /practica/wilson/api/solicitudes dentro de useEffect.</p>
        <div className="mt-4">
          <SolicitudesDesdeCliente />
        </div>
      </section>
    </main>
  );
}
