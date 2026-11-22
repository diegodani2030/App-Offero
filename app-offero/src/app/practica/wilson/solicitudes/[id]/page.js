import Link from "next/link";
import { notFound } from "next/navigation";
import EtiquetaEstado from "../../_components/EtiquetaEstado";
import { solicitudes } from "../../datos";

// Next 2: una sola carpeta [id] sirve para todas las solicitudes.
// Los corchetes dicen "esta parte de la URL es variable"; su valor llega en params.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const solicitud = solicitudes.find((s) => String(s.id) === id);
  return { title: solicitud ? `${solicitud.titulo} · Práctica` : "No encontrada · Práctica" };
}

export default async function DetalleSolicitud({ params }) {
  // En esta versión de Next, params es una promesa: se usa con await.
  const { id } = await params;
  // El id de la URL siempre es texto; en datos.js es número.
  const solicitud = solicitudes.find((s) => String(s.id) === id);

  // Si alguien escribe un id que no existe, se muestra not-found.js (no un error).
  if (!solicitud) notFound();

  return (
    <main>
      <Link href="/practica/wilson/solicitudes" className="text-sm text-blue-600 hover:underline">
        ← Volver a mis solicitudes
      </Link>
      <h1 className="mt-4 text-2xl font-bold">{solicitud.titulo}</h1>
      <dl className="mt-4 flex flex-col gap-2">
        <div>
          <dt className="text-sm text-gray-500">Cantidad</dt>
          <dd>{solicitud.cantidad}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Fecha límite</dt>
          <dd>{solicitud.fechaLimite}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Cotizaciones</dt>
          <dd>{solicitud.cotizaciones}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Estado</dt>
          <dd>
            <EtiquetaEstado estado={solicitud.estado} />
          </dd>
        </div>
      </dl>
    </main>
  );
}
