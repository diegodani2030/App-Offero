import EtiquetaEstado from "./EtiquetaEstado";

export default function TarjetaSolicitud({
  titulo,
  cantidad,
  fechaLimite,
  estado,
  destacado = false,
}) {
  return (
    <article
      className={`rounded-lg border p-4 ${destacado ? "border-blue-500" : "border-gray-300"}`}
    >
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <p>Cantidad: {cantidad}</p>
      <p>Fecha límite: {fechaLimite}</p>
      <EtiquetaEstado estado={estado} />
    </article>
  );
}