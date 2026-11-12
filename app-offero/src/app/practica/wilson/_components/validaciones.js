// Cada función recibe un valor y devuelve un mensaje de error, o null si está bien.

export function validarTitulo(titulo) {
  const largo = titulo.trim().length;
  if (largo < 5) return "El título debe tener al menos 5 caracteres.";
  if (largo > 100) return "El título no puede pasar de 100 caracteres.";
  return null;
}

export function validarCantidad(cantidad) {
  const numero = Number(cantidad);
  if (!Number.isInteger(numero) || numero <= 0) {
    return "La cantidad debe ser un número entero mayor que 0.";
  }
  return null;
}

// Fecha de hoy en formato AAAA-MM-DD, con la hora local del navegador.
function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function validarFecha(fecha) {
  if (!fecha) return "Elige una fecha límite.";
  // Las fechas AAAA-MM-DD se pueden comparar como texto.
  if (fecha < hoy()) return "La fecha límite no puede ser anterior a hoy.";
  return null;
}
