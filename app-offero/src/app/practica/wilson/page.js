import PanelSolicitudes from "@/components/practica/wilson/PanelSolicitudes";
import { solicitudes } from "./datos";

export default function PracticaWilson() {
  return (
    <main className="p-8">
      {/* Ternario: singular o plural según cuántas haya. */}
      <h1 className="text-2xl font-bold">
        {solicitudes.length === 1
          ? "1 solicitud"
          : `${solicitudes.length} solicitudes`}
      </h1>
      <div className="mt-4">
        <PanelSolicitudes items={solicitudes} />
      </div>
    </main>
  );
}
