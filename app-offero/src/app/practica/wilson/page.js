import GestorSolicitudes from "@/components/practica/wilson/GestorSolicitudes";
import { solicitudes } from "./datos";

export default function PracticaWilson() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>
      <div className="mt-4">
        <GestorSolicitudes iniciales={solicitudes} />
      </div>
    </main>
  );
}
