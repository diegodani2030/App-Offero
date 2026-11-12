"use client";

import { useActionState } from "react";
import { iniciarSesion } from "./actions";

export default function FormularioLogin() {
    const [estado, accion, pendiente] = useActionState(iniciarSesion, {});

    return (
        <form action={accion} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Correo</span>
        <input
          type="email"
          name="correo"
          required
          autoComplete="email"
          defaultValue={estado.correo}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Contraseña</span>
        <input
          type="password"
          name="contrasena"
          required
          autoComplete="current-password"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      {estado.error && (
        <p role="alert" className="text-sm text-red-600">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="rounded-md bg-foreground px-4 py-2 font-semibold text-background disabled:opacity-50"
      >
        {pendiente ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
