"use client";

import { useState } from "react";
import Link from "next/link";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/#como-funciona", texto: "¿Cómo funciona?" },
];

export default function MenuHamburguesa() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <ul className="hidden items-center gap-6 md:flex">
        {enlaces.map((enlace) => (
          <li key={enlace.href}>
            <Link href={enlace.href} className="text-slate-300 hover:text-white">
              {enlace.texto}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        onClick={() => setAbierto(!abierto)}
        onKeyDown={(evento) => evento.key === "Escape" && setAbierto(false)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg text-white hover:bg-white/10 md:hidden"
      >
        <span
          className={`h-0.5 w-6 bg-current transition-transform ${abierto ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-current transition-opacity ${abierto ? "opacity-0" : ""}`}
        />
        <span
          className={`h-0.5 w-6 bg-current transition-transform ${abierto ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      <ul
        id="menu-movil"
        className={`absolute inset-x-0 top-full border-b border-[#263049] bg-[#07090f] px-4 py-2 md:hidden ${abierto ? "block" : "hidden"}`}
      >
        {enlaces.map((enlace) => (
          <li key={enlace.href}>
            <Link
              href={enlace.href}
              onClick={() => setAbierto(false)}
              className="block py-3 text-slate-300 hover:text-white"
            >
              {enlace.texto}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
