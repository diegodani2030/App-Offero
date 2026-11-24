"use client";

import { useActionState } from "react";

// Formulario para cambiar el nombre en /perfil (OFF-011).
// La Server Action llega por props (accion) y devuelve { error, valor } o { exito }.
// La validación que cuenta es la del servidor; por eso el form lleva noValidate.

const ESTILO_CAMPO =
  "rounded-md border border-[#263049] bg-[#0d111a] px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none";

export default function FormularioNombre({ accion, nombreActual }) {
  const [estado, enviar, pendiente] = useActionState(accion, {});

  return (
    <form action={enviar} noValidate className="flex flex-col gap-2">
      <label htmlFor="nombre" className="text-sm text-slate-400">
        Nombre
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          // Si hubo error se muestra lo que escribió; si no, el nombre guardado.
          defaultValue={estado.valor ?? nombreActual}
          aria-describedby="nombre-error"
          className={`${ESTILO_CAMPO} flex-1`}
        />
        <button
          type="submit"
          disabled={pendiente}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : "Guardar"}
        </button>
      </div>
      <p id="nombre-error" role="alert" className="min-h-5 text-sm text-red-400">
        {estado.error}
      </p>
      {estado.exito && (
        <p role="status" className="text-sm text-green-300">
          {estado.exito}
        </p>
      )}
    </form>
  );
}
