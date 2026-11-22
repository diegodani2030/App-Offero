"use client";

import { useState } from "react";

// Next 3 (reto): componente de cliente que recibe children.
// Lo que llega en children puede ser un componente de servidor: el servidor ya lo
// dibujó y aquí solo se decide si se muestra o no.
export default function Desplegable({ titulo, children }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <section className="rounded-lg border border-gray-300 p-4">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className="font-semibold text-blue-600 hover:underline"
      >
        {abierto ? "▼" : "▶"} {titulo}
      </button>
      {abierto && <div className="mt-3">{children}</div>}
    </section>
  );
}
