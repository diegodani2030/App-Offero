"use client";

import { useState } from "react";
import FormularioSolicitud from "./FormularioSolicitud";
import PanelSolicitudes from "./PanelSolicitudes";

// Padre que guarda la lista: el formulario agrega, el panel muestra.
export default function GestorSolicitudes({ iniciales }) {
  const [items, setItems] = useState(iniciales);

  function agregar(nuevo) {
    // Copia del arreglo: nunca se modifica el original con push.
    setItems([...items, nuevo]);
  }

  return (
    <div className="flex flex-col gap-8">
      <FormularioSolicitud onCrear={agregar} />
      <PanelSolicitudes items={items} />
    </div>
  );
}
