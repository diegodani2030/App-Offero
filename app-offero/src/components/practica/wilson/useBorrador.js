"use client";

import { useEffect, useState } from "react";

// Guarda y recupera un borrador en localStorage. Devuelve [datos, setDatos] como useState.
export default function useBorrador(clave, inicial) {
  const [datos, setDatos] = useState(inicial);
  const [cargado, setCargado] = useState(false);

  // Al abrir la página: recupera el borrador una sola vez (dependencias vacías).
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(clave);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el navegador
      if (guardado) setDatos(JSON.parse(guardado));
    } catch {
      // Si el navegador bloquea localStorage, se sigue sin borrador.
    }
    setCargado(true);
  }, [clave]);

  // Cada vez que cambian los datos: guarda el borrador.
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
    } catch {
      // Sin localStorage no hay borrador; el formulario funciona igual.
    }
  }, [clave, datos, cargado]);

  return [datos, setDatos];
}
