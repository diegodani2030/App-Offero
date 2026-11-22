"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Next 2 (reto): resalta el enlace de la página actual.
// Es de cliente porque usePathname lee la URL del navegador.
const ENLACES = [
  { href: "/practica/wilson", texto: "Inicio" },
  { href: "/practica/wilson/solicitudes", texto: "Solicitudes" },
  { href: "/practica/wilson/api-demo", texto: "API demo" },
  { href: "/practica/wilson/acerca", texto: "Acerca" },
];

export default function MenuPractica() {
  const ruta = usePathname();

  return (
    <nav className="mt-2 flex flex-wrap gap-4 text-sm">
      {ENLACES.map((enlace) => {
        // Inicio solo se marca en su ruta exacta; los demás también en sus subrutas
        // (así "Solicitudes" queda marcado en el detalle /solicitudes/3).
        const activo =
          enlace.href === "/practica/wilson"
            ? ruta === enlace.href
            : ruta === enlace.href || ruta.startsWith(`${enlace.href}/`);
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            aria-current={activo ? "page" : undefined}
            className={activo ? "font-bold text-blue-400 underline" : "text-blue-600 hover:underline"}
          >
            {enlace.texto}
          </Link>
        );
      })}
    </nav>
  );
}
