import TarjetaSolicitud from "@/components/practica/wilson/TarjetaSolicitud";

export default function PracticaWilson() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Mis solicitudes</h1>
      <div className="mt-4 flex flex-col gap-4">
        <TarjetaSolicitud
          titulo="Sillas para oficina"
          cantidad={50}
          fechaLimite="2026-11-30"
          estado="open"
          destacado={true}
        />
        <TarjetaSolicitud
          titulo="Mesas de reunión"
          cantidad={10}
          fechaLimite="2026-12-05"
          estado="awarded"
        />
        <TarjetaSolicitud
          titulo="Cajas de cartón"
          cantidad={200}
          fechaLimite="2026-12-15"
          estado="cancelled"
        />
      </div>
    </main>
  );
}
