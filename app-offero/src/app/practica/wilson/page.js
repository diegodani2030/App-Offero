import ListaSolicitudes from "@/components/practica/wilson/ListaSolicitudes";
import { solicitudes } from "./datos";

export default function PracticaWilson() {
  // Reto: filter deja solo las abiertas antes de pintarlas.
  const abiertas = solicitudes.filter((s) => s.estado === "open");

  return (
    <main className="p-8">
      {/* Condicional 3 (ternario): singular o plural según cuántas haya. */}
      <h1 className="text-2xl font-bold">
        {solicitudes.length === 1
          ? "1 solicitud"
          : `${solicitudes.length} solicitudes`}
      </h1>
      <div className="mt-4">
        <ListaSolicitudes items={solicitudes} />
      </div>

      <h2 className="mt-8 text-xl font-bold">Solo abiertas ({abiertas.length})</h2>
      <div className="mt-4">
        <ListaSolicitudes items={abiertas} />
      </div>

      <h2 className="mt-8 text-xl font-bold">Lista vacía</h2>
      <div className="mt-4">
        <ListaSolicitudes items={[]} />
      </div>
    </main>
  );
}
