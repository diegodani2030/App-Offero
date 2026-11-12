"use client";

import { useState } from "react";
import Campo from "./Campo";
import useBorrador from "./useBorrador";
import { validarCantidad, validarFecha, validarTitulo } from "./validaciones";

const VACIO = { titulo: "", cantidad: "", fechaLimite: "" };

export default function FormularioSolicitud({ onCrear }) {
  // Como useState, pero el valor se guarda en localStorage (ver useBorrador.js).
  const [datos, setDatos] = useBorrador("practica-wilson-borrador", VACIO);
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
  }

  function enviar(event) {
    event.preventDefault(); // sin esto la página se recarga
    const nuevosErrores = {
      titulo: validarTitulo(datos.titulo),
      cantidad: validarCantidad(datos.cantidad),
      fechaLimite: validarFecha(datos.fechaLimite),
    };
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some((e) => e !== null)) return;

    onCrear({
      id: crypto.randomUUID(),
      titulo: datos.titulo.trim(),
      cantidad: Number(datos.cantidad),
      fechaLimite: datos.fechaLimite,
      estado: "open",
      cotizaciones: 0,
    });
    setDatos(VACIO);
  }

  const hayVacios = !datos.titulo || !datos.cantidad || !datos.fechaLimite;
  // Reto: el contador sale directo del estado, sin useEffect.
  const largo = datos.titulo.length;

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
      <Campo etiqueta="Título" id="titulo" error={errores.titulo}>
        <input id="titulo" type="text" value={datos.titulo}
          onChange={(e) => cambiar("titulo", e.target.value)}
          className="rounded border border-gray-300 px-3 py-2" />
        <span className={`text-xs ${largo > 90 ? "text-red-600" : "text-gray-500"}`}>
          {largo}/100
        </span>
      </Campo>
      <Campo etiqueta="Cantidad" id="cantidad" error={errores.cantidad}>
        <input id="cantidad" type="number" value={datos.cantidad}
          onChange={(e) => cambiar("cantidad", e.target.value)}
          className="rounded border border-gray-300 px-3 py-2" />
      </Campo>
      <Campo etiqueta="Fecha límite" id="fechaLimite" error={errores.fechaLimite}>
        <input id="fechaLimite" type="date" value={datos.fechaLimite}
          onChange={(e) => cambiar("fechaLimite", e.target.value)}
          className="rounded border border-gray-300 px-3 py-2" />
      </Campo>
      <button type="submit" disabled={hayVacios}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300">
        Publicar solicitud
      </button>
    </form>
  );
}
