"use client";

import Link from "next/link";

// Next 4: lo que se ve cuando algo dentro de api-demo lanza un error.
// error.js tiene que ser de cliente porque tiene un botón. En esta versión de Next
// la función para reintentar se llama retry (en versiones viejas era reset).
export default function ErrorApiDemo({ error, retry }) {
  return (
    <main>
      <h1 className="text-2xl font-bold">No pudimos traer los datos</h1>
      <p className="mt-2 text-gray-500">La API externa no respondió bien. Inténtalo de nuevo en un momento.</p>
      {error?.message && <p className="mt-1 text-sm text-gray-400">Detalle: {error.message}</p>}
      <div className="mt-4 flex gap-4">
        <button type="button" onClick={() => retry()} className="text-blue-600 hover:underline">
          Reintentar
        </button>
        <Link href="/practica/wilson/api-demo" className="text-blue-600 hover:underline">
          Volver a la URL buena
        </Link>
      </div>
    </main>
  );
}
