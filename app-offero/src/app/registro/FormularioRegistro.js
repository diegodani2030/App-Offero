"use client";

import { useActionState } from "react";
import { registrarse } from "./actions";

export default function FormularioRegistro() {
  const [estado, accion, pendiente] = useActionState(registrarse, {});

  if (estado.exito) {
    return (
      <p role="status" className="mt-8 text-green-500">
        {estado.exito}
      </p>
    );
  }

  return (
    <form action={accion} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nombre</span>
        <input
          type="text"
          name="nombre"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          defaultValue={estado.nombre}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

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
          minLength={8}
          autoComplete="new-password"
          className="rounded-md border border-gray-300 px-3 py-2"
        />
        <span className="text-xs text-gray-500">Mínimo 8 caracteres.</span>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Quiero usar Offero como</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="rol"
            value="client"
            required
            defaultChecked={estado.rol === "client"}
          />
          Cliente: pido cotizaciones
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="rol"
            value="provider"
            defaultChecked={estado.rol === "provider"}
          />
          Proveedor: envío cotizaciones
        </label>
      </fieldset>

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
        {pendiente ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}