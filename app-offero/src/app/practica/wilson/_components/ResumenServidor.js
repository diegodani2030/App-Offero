import { solicitudes } from "../datos";

// Next 3 (reto): componente de SERVIDOR (sin "use client") que se mete dentro de
// Desplegable (de cliente) usando children. Calcula el resumen en el servidor:
// al navegador solo llega el HTML ya hecho, no este código.
export default function ResumenServidor() {
  const abiertas = solicitudes.filter((s) => s.estado === "open").length;
  const sinCotizaciones = solicitudes.filter((s) => s.cotizaciones === 0).length;

  return (
    <ul className="list-disc pl-5 text-sm">
      <li>Total: {solicitudes.length}</li>
      <li>Abiertas: {abiertas}</li>
      <li>Sin cotizaciones: {sinCotizaciones}</li>
      <li className="text-gray-500">Calculado en el servidor el {new Date().toLocaleString("es-CO")}</li>
    </ul>
  );
}
