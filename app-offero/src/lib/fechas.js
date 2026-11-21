// Hoy en Bogotá como AAAA-MM-DD ("en-CA" da ese formato).
// Se usa en el servidor para que la página y la validación tengan la misma fecha,
// sin depender de la zona horaria del servidor ni del navegador.
export function hoyEnBogota() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

// true si el texto es una fecha real en formato AAAA-MM-DD (rechaza, por ejemplo, 2026-02-30).
export function esFechaValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto;
}
