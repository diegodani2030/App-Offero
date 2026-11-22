"use client";

import { useEffect, useState } from "react";

// Next 4 (reto): la misma idea, pero desde el CLIENTE con fetch dentro de useEffect.
// Comparado con ListaUsuarios (servidor) hace falta manejar a mano tres estados:
// cargando, error y datos. Por eso la versión de servidor es más simple.
export default function SolicitudesDesdeCliente() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    fetch("/practica/wilson/api/solicitudes")
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Mi API respondió ${respuesta.status}`);
        return respuesta.json();
      })
      .then((json) => {
        if (!cancelado) setDatos(json);
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      });
    // Si el componente se quita antes de que llegue la respuesta, no se actualiza el estado.
    return () => {
      cancelado = true;
    };
  }, []);

  if (error) return <p className="text-red-600">No se pudo cargar: {error}</p>;
  if (!datos) return <p className="text-gray-500">Cargando…</p>;
  if (datos.length === 0) return <p className="text-gray-500">No hay solicitudes.</p>;

  return (
    <ul className="list-disc pl-5">
      {datos.map((s) => (
        <li key={s.id}>
          {s.titulo} · {s.estado}
        </li>
      ))}
    </ul>
  );
}
