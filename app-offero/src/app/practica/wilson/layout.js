import MenuPractica from "./_components/MenuPractica";

// Layout anidado: envuelve todas las páginas dentro de /practica/wilson.
// El Header y el Footer del layout raíz siguen apareciendo por fuera.
// El layout es de servidor; solo el menú (que lee la URL) es de cliente.
export default function LayoutPracticaWilson({ children }) {
  return (
    <div className="p-8">
      <header className="mb-6 border-b border-gray-300 pb-4">
        <p className="text-lg font-bold">Práctica de Wilson</p>
        <MenuPractica />
      </header>
      {/* Sin children las páginas saldrían en blanco. */}
      {children}
    </div>
  );
}
