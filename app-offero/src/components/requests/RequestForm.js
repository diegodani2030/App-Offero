"use client";

import { useActionState } from "react";

// Formulario de solicitud (T1-14 y OFF-023). Recibe la Server Action por props (accion),
// así sirve para crear y, más adelante, para editar. La acción devuelve
// { errores, valores } o { error }, y el formulario muestra cada error junto a su campo.
// Los límites del navegador (minLength, max...) copian los CHECK de la tabla requests,
// pero la validación que cuenta es la del servidor. Por eso el form lleva noValidate:
// así siempre se ven los mensajes del servidor.

const ESTILO_CAMPO =
  "rounded-md border border-[#263049] bg-[#0d111a] px-3 py-2 text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none";

// Etiqueta + campo + espacio para el error debajo. El espacio queda reservado
// aunque no haya error, para que el formulario no salte cuando aparezca uno.
function Campo({ id, etiqueta, ayuda, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      {children}
      {ayuda && <p className="text-xs text-slate-400">{ayuda}</p>}
      <p id={`${id}-error`} role="alert" className="min-h-5 text-sm text-red-400">
        {error}
      </p>
    </div>
  );
}

// fechaMinima llega de la página (hoy en Bogotá, AAAA-MM-DD) para no dejar elegir días pasados.
export default function RequestForm({ accion, categorias, fechaMinima }) {
  const [estado, enviar, pendiente] = useActionState(accion, {});
  const errores = estado.errores ?? {};
  const valores = estado.valores ?? {};

  return (
    <form action={enviar} noValidate className="mt-8 flex flex-col gap-2">
      <Campo id="titulo" etiqueta="¿Qué necesitas?" ayuda="Entre 5 y 120 caracteres." error={errores.titulo}>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          minLength={5}
          maxLength={120}
          defaultValue={valores.titulo}
          placeholder="Ej.: 50 sillas para un evento"
          aria-describedby="titulo-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <Campo id="descripcion" etiqueta="Descripción" ayuda="Entre 10 y 2000 caracteres." error={errores.descripcion}>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={4}
          minLength={10}
          maxLength={2000}
          defaultValue={valores.descripcion}
          placeholder="Cuéntales a los proveedores los detalles: materiales, tamaños, colores…"
          aria-describedby="descripcion-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <Campo id="categoria" etiqueta="Categoría" error={errores.categoria}>
        <select
          id="categoria"
          name="categoria"
          required
          defaultValue={valores.categoria ?? ""}
          aria-describedby="categoria-error"
          className={ESTILO_CAMPO}
        >
          <option value="" disabled>
            Elige una categoría
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Campo>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <Campo id="cantidad" etiqueta="Cantidad" error={errores.cantidad}>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            required
            min={1}
            step={1}
            inputMode="numeric"
            defaultValue={valores.cantidad}
            aria-describedby="cantidad-error"
            className={ESTILO_CAMPO}
          />
        </Campo>

        <Campo id="fechaLimite" etiqueta="Fecha límite" error={errores.fechaLimite}>
          <input
            id="fechaLimite"
            name="fechaLimite"
            type="date"
            required
            min={fechaMinima}
            defaultValue={valores.fechaLimite}
            aria-describedby="fechaLimite-error"
            className={`${ESTILO_CAMPO} [color-scheme:dark]`}
          />
        </Campo>
      </div>

      <Campo id="ubicacion" etiqueta="Ubicación" ayuda="Ciudad y barrio." error={errores.ubicacion}>
        <input
          id="ubicacion"
          name="ubicacion"
          type="text"
          required
          minLength={2}
          maxLength={200}
          defaultValue={valores.ubicacion}
          placeholder="Ej.: Bogotá, Chapinero"
          aria-describedby="ubicacion-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <button
        type="submit"
        disabled={pendiente}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pendiente ? "Publicando…" : "Publicar solicitud"}
      </button>
      {estado.error && (
        <p role="alert" className="text-center text-sm text-red-400">
          {estado.error}
        </p>
      )}
    </form>
  );
}
