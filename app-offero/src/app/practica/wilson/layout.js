import Link from "next/link";

// Layout anidado: envuelve todas las páginas dentro de /practica/wilson.
// El Header y el Footer del layout raíz siguen apareciendo por fuera.
export default function LayoutPracticaWilson({ children }) {
  return (
    <div className="p-8">
      <header className="mb-6 border-b border-gray-300 pb-4">
        <p className="text-lg font-bold">Práctica de Wilson</p>
        <nav className="mt-2 flex gap-4 text-sm text-blue-600">
          <Link href="/practica/wilson">Inicio</Link>
          <Link href="/practica/wilson/solicitudes">Solicitudes</Link>
          <Link href="/practica/wilson/acerca">Acerca</Link>
        </nav>
      </header>
      {/* Sin children las páginas saldrían en blanco. */}
      {children}
    </div>
  );
}
