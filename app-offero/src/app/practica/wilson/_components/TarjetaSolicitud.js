import Link from "next/link";
import EtiquetaEstado from "./EtiquetaEstado";

export default function TarjetaSolicitud({
  id,
  titulo,
  cantidad,
  fechaLimite,
  estado,
  cotizaciones,
  destacado = false,
}) {
  return (
    <article
      className={`rounded-lg border p-4 ${destacado ? "border-blue-500" : "border-gray-300"}`}
    >
      <h2 className="text-lg font-semibold">
        {/* Next 2: cada tarjeta lleva al detalle. Link navega sin recargar la página. */}
        <Link href={`/practica/wilson/solicitudes/${id}`} className="hover:underline">
          {titulo}
        </Link>
      </h2>
      <p>Cantidad: {cantidad}</p>
      <p>Fecha límite: {fechaLimite}</p>
      <EtiquetaEstado estado={estado} />
      {/* Condicional 2 (&&): solo aparece si no hay cotizaciones.
          Se compara con === 0 porque {cotizaciones && ...} pintaría un "0" en pantalla. */}
      {cotizaciones === 0 && (
        <p className="mt-2 text-sm text-gray-500">Sin cotizaciones todavía</p>
      )}
    </article>
  );
}