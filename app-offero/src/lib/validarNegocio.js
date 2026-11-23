// Valida en el servidor los datos del formulario «Mi negocio» (crear y editar).
// Los límites copian los CHECK de las tablas businesses y business_contacts,
// para dar un mensaje claro antes de que la base de datos rechace el dato.
// Devuelve { datos, errores }: datos ya limpios para businesses.js y un error por campo.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Celular colombiano: 10 dígitos y empieza por 3 (mismo CHECK de business_contacts).
const CELULAR = /^3[0-9]{9}$/;
// Varias categorías por negocio (D-13), con un tope para que el negocio no
// aparezca en todas las categorías del filtro.
export const MAXIMO_CATEGORIAS = 3;

export function leerFormularioNegocio(formData) {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    ubicacion: String(formData.get("ubicacion") ?? "").trim(),
    // Las casillas marcadas llegan como varios valores con el mismo nombre.
    categorias: formData.getAll("categorias").map(String),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
  };
}

// Deja solo los dígitos y quita el indicativo de Colombia si lo escribieron.
// "+57 300 123 4567" → "3001234567"
export function limpiarCelular(texto) {
  const digitos = texto.replace(/\D/g, "");
  return digitos.length === 12 && digitos.startsWith("57") ? digitos.slice(2) : digitos;
}

// categoriasValidas: los id de las categorías que existen (los trae la Server Action).
export function validarNegocio(valores, categoriasValidas) {
  const errores = {};

  if (valores.nombre.length < 2 || valores.nombre.length > 100) {
    errores.nombre = "El nombre debe tener entre 2 y 100 caracteres.";
  }
  if (valores.descripcion.length < 10 || valores.descripcion.length > 1000) {
    errores.descripcion = "La descripción debe tener entre 10 y 1000 caracteres.";
  }
  if (valores.ubicacion.length < 2 || valores.ubicacion.length > 100) {
    errores.ubicacion = "Escribe la ciudad y el barrio (entre 2 y 100 caracteres).";
  }

  // Sin repetidas, y cada una tiene que existir de verdad.
  const categorias = [...new Set(valores.categorias)];
  if (categorias.length === 0) {
    errores.categorias = "Elige al menos una categoría.";
  } else if (categorias.length > MAXIMO_CATEGORIAS) {
    errores.categorias = `Elige máximo ${MAXIMO_CATEGORIAS} categorías.`;
  } else if (categorias.some((id) => !UUID.test(id) || !categoriasValidas.includes(id))) {
    errores.categorias = "Una de las categorías no existe. Vuelve a elegirlas.";
  }

  const whatsapp = limpiarCelular(valores.whatsapp);
  if (!CELULAR.test(whatsapp)) {
    errores.whatsapp = "Escribe un celular de 10 dígitos que empiece por 3.";
  }

  const datos = {
    nombre: valores.nombre,
    descripcion: valores.descripcion,
    ubicacion: valores.ubicacion,
    categoriaIds: categorias,
    whatsapp,
  };

  return { datos, errores };
}
