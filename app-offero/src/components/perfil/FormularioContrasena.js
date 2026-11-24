"use client";

import { useActionState } from "react";

// Formulario para cambiar la contraseña en /perfil/contrasena (OFF-063).
// La Server Action llega por props (accion) y devuelve { errores }, { error } o { exito }.
// Los campos nunca se vuelven a llenar con la contraseña: React los vacía después de enviar.

const ESTILO_CAMPO =
  "rounded-md border border-[#263049] bg-[#0d111a] px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none";

function CampoContrasena({ id, etiqueta, ayuda, autoComplete, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type="password"
        required
        maxLength={72}
        autoComplete={autoComplete}
        aria-describedby={`${id}-error`}
        className={ESTILO_CAMPO}
      />
      {ayuda && <p className="text-xs text-slate-400">{ayuda}</p>}
      <p id={`${id}-error`} role="alert" className="min-h-5 text-sm text-red-400">
        {error}
      </p>
    </div>
  );
}

export default function FormularioContrasena({ accion }) {
  const [estado, enviar, pendiente] = useActionState(accion, {});
  const errores = estado.errores ?? {};

  return (
    <form action={enviar} noValidate className="mt-8 flex flex-col gap-2">
      <CampoContrasena
        id="actual"
        etiqueta="Contraseña actual"
        ayuda="Si el equipo te dio una contraseña temporal, escríbela aquí."
        autoComplete="current-password"
        error={errores.actual}
      />
      <CampoContrasena
        id="nueva"
        etiqueta="Contraseña nueva"
        ayuda="Entre 8 y 72 caracteres."
        autoComplete="new-password"
        error={errores.nueva}
      />
      <CampoContrasena
        id="confirmacion"
        etiqueta="Repite la contraseña nueva"
        autoComplete="new-password"
        error={errores.confirmacion}
      />
      <button
        type="submit"
        disabled={pendiente}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pendiente ? "Cambiando…" : "Cambiar contraseña"}
      </button>
      {estado.error && (
        <p role="alert" className="text-center text-sm text-red-400">
          {estado.error}
        </p>
      )}
      {estado.exito && (
        <p role="status" className="rounded-md border border-green-700 bg-green-950 p-3 text-sm text-green-200">
          {estado.exito}
        </p>
      )}
    </form>
  );
}
