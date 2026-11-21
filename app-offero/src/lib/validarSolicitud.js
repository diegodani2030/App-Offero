import { esFechaValida, hoyEnBogota } from "@/lib/fechas";

// Valida en el servidor los datos del formulario de solicitud (crear y, más adelante, editar).
// Los límites son los mismos CHECK de la tabla requests, para dar un mensaje claro
// antes de que la base de datos rechace el dato.
// Devuelve { datos, errores }: datos ya limpios para requests.js y un error por campo.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Tope razonable para que un número enorme no rompa la columna integer.
const CANTIDAD_MAXIMA = 1_000_000;

export function leerFormularioSolicitud(formData) {
  return {
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    categoria: String(formData.get("categoria") ?? ""),
    cantidad: String(formData.get("cantidad") ?? "").trim(),
    ubicacion: String(formData.get("ubicacion") ?? "").trim(),
    fechaLimite: String(formData.get("fechaLimite") ?? ""),
  };
}

export function validarSolicitud(valores) {
  const errores = {};

  if (valores.titulo.length < 5 || valores.titulo.length > 120) {
    errores.titulo = "El título debe tener entre 5 y 120 caracteres.";
  }
  if (valores.descripcion.length < 10 || valores.descripcion.length > 2000) {
    errores.descripcion = "La descripción debe tener entre 10 y 2000 caracteres.";
  }
  if (!UUID.test(valores.categoria)) {
    errores.categoria = "Elige una categoría.";
  }

  const cantidad = Number(valores.cantidad);
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    errores.cantidad = "La cantidad debe ser un número entero mayor que 0.";
  } else if (cantidad > CANTIDAD_MAXIMA) {
    errores.cantidad = `La cantidad no puede pasar de ${CANTIDAD_MAXIMA.toLocaleString("es-CO")}.`;
  }

  if (valores.ubicacion.length < 2 || valores.ubicacion.length > 200) {
    errores.ubicacion = "Escribe la ciudad y el barrio (entre 2 y 200 caracteres).";
  }

  if (!esFechaValida(valores.fechaLimite)) {
    errores.fechaLimite = "Elige una fecha límite.";
  } else if (valores.fechaLimite < hoyEnBogota()) {
    // Las fechas AAAA-MM-DD se pueden comparar como texto.
    errores.fechaLimite = "La fecha límite no puede ser anterior a hoy.";
  }

  const datos = {
    categoriaId: valores.categoria,
    titulo: valores.titulo,
    descripcion: valores.descripcion,
    cantidad,
    ubicacion: valores.ubicacion,
    fechaLimite: valores.fechaLimite,
  };

  return { datos, errores };
}
