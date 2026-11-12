import GestorSolicitudes from "../_components/GestorSolicitudes";
import { solicitudes } from "../datos";

export const metadata = {
  title: "Mis solicitudes · Práctica",
};

export default function PaginaSolicitudes() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>
      <div className="mt-4">
        <GestorSolicitudes iniciales={solicitudes} />
      </div>
    </main>
  );
}
