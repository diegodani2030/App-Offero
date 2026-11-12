"use client";

import { useState } from "react";
import FiltroEstado from "./FiltroEstado";
import ListaSolicitudes from "./ListaSolicitudes";

export default function PanelSolicitudes({ items }) {
  // El estado vive en el padre: cuando cambia, React vuelve a pintar el panel.
  const [estadoActivo, setEstadoActivo] = useState("todas");
  // Reto: segundo estado para buscar por título.
  const [busqueda, setBusqueda] = useState("");

  // La lista visible se calcula en cada render; no se guarda en otro estado.
  const visibles = items
    .filter((item) => estadoActivo === "todas" || item.estado === estadoActivo)
    .filter((item) =>
      item.titulo.toLowerCase().includes(busqueda.toLowerCase()),
    );

  return (
    <section className="flex flex-col gap-4">
      <FiltroEstado valor={estadoActivo} onCambiar={setEstadoActivo} />
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por título"
        className="rounded border border-gray-300 px-3 py-2"
      />
      <p className="text-sm text-gray-600">
        Mostrando {visibles.length} de {items.length}
      </p>
      <ListaSolicitudes items={visibles} />
    </section>
  );
}
