import { solicitudes } from "../../datos";

// Next 4: mi propia API. Un route.js con GET responde en /practica/wilson/api/solicitudes.
// Ábrelo en el navegador y verás el arreglo de datos.js en JSON.
export function GET() {
  return Response.json(solicitudes);
}
