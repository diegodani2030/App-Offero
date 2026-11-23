"use client";

import { useActionState } from "react";

// Formulario «Mi negocio» (OFF-015 y OFF-016). Sirve para crear y para editar:
// si llega "negocio", los campos empiezan con sus datos y el botón dice "Guardar cambios".
// La Server Action llega por props (accion) y devuelve { errores, valores }, { error } o { exito }.
// Los límites del navegador (maxLength...) copian los CHECK de las tablas, pero la validación
// que cuenta es la del servidor. Por eso el form lleva noValidate: así siempre se ven
// los mensajes del servidor.

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

// categorias: todas las categorías reales. negocio: el del usuario, o null si no tiene.
// maximoCategorias: el mismo tope que revisa el servidor (validarNegocio.js).
export default function BusinessForm({ accion, categorias, negocio, maximoCategorias }) {
  const [estado, enviar, pendiente] = useActionState(accion, {});
  const errores = estado.errores ?? {};

  // Si el servidor devolvió errores, se muestra lo que el usuario escribió;
  // si no, lo que hay guardado (o vacío si todavía no tiene negocio).
  const valores = estado.valores ?? {
    nombre: negocio?.name ?? "",
    descripcion: negocio?.description ?? "",
    ubicacion: negocio?.location ?? "",
    categorias: negocio?.categorias.map((c) => c.id) ?? [],
    whatsapp: negocio?.contacto?.whatsapp ?? "",
  };

  return (
    <form action={enviar} noValidate className="mt-8 flex flex-col gap-2">
      <Campo id="nombre" etiqueta="Nombre del negocio" ayuda="Entre 2 y 100 caracteres." error={errores.nombre}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          maxLength={100}
          defaultValue={valores.nombre}
          placeholder="Ej.: Carpintería El Roble"
          aria-describedby="nombre-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <Campo
        id="descripcion"
        etiqueta="Descripción"
        ayuda="Qué haces o vendes. Entre 10 y 1000 caracteres."
        error={errores.descripcion}
      >
        <textarea
          id="descripcion"
          name="descripcion"
          required
          rows={4}
          maxLength={1000}
          defaultValue={valores.descripcion}
          placeholder="Ej.: Fabricamos muebles a la medida en madera: mesas, sillas y closets."
          aria-describedby="descripcion-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <fieldset aria-describedby="categorias-error" className="flex flex-col gap-1">
        <legend className="text-sm font-medium">Categorías</legend>
        <p className="text-xs text-slate-400">
          Elige entre 1 y {maximoCategorias}. Así te encuentran los clientes.
        </p>
        <div className="mt-1 grid gap-2 sm:grid-cols-2">
          {categorias.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 rounded-md border border-[#263049] bg-[#0d111a] px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="categorias"
                value={c.id}
                defaultChecked={valores.categorias.includes(c.id)}
                className="accent-blue-500"
              />
              {c.name}
            </label>
          ))}
        </div>
        <p id="categorias-error" role="alert" className="min-h-5 text-sm text-red-400">
          {errores.categorias}
        </p>
      </fieldset>

      <Campo id="ubicacion" etiqueta="Ubicación" ayuda="Ciudad y barrio." error={errores.ubicacion}>
        <input
          id="ubicacion"
          name="ubicacion"
          type="text"
          required
          maxLength={100}
          defaultValue={valores.ubicacion}
          placeholder="Ej.: Bogotá, Kennedy"
          aria-describedby="ubicacion-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <Campo
        id="whatsapp"
        etiqueta="WhatsApp"
        ayuda="Celular de 10 dígitos. Solo lo verá el cliente que elija tu cotización."
        error={errores.whatsapp}
      >
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          inputMode="numeric"
          autoComplete="tel-national"
          defaultValue={valores.whatsapp}
          placeholder="Ej.: 3001234567"
          aria-describedby="whatsapp-error"
          className={ESTILO_CAMPO}
        />
      </Campo>

      <button
        type="submit"
        disabled={pendiente}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {pendiente ? "Guardando…" : negocio ? "Guardar cambios" : "Crear mi negocio"}
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
