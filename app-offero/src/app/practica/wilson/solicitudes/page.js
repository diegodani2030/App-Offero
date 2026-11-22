import Desplegable from "../_components/Desplegable";
import GestorSolicitudes from "../_components/GestorSolicitudes";
import ResumenServidor from "../_components/ResumenServidor";
import { solicitudes } from "../datos";

export const metadata = {
  title: "Mis solicitudes · Práctica",
};

// Next 3: esta página es de SERVIDOR (sin "use client").
// Los datos bajan al cliente por props (iniciales); solo lo interactivo es de cliente.
export default function PaginaSolicitudes() {
  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>
      <Desplegable titulo="Ver resumen">
        <ResumenServidor />
      </Desplegable>
      <GestorSolicitudes iniciales={solicitudes} />
    </main>
  );
}
