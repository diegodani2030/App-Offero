import TarjetaSolicitud from "./TarjetaSolicitud";

// Recibe un arreglo de solicitudes y pinta una tarjeta por cada una.
export default function ListaSolicitudes({ items }) {
  // Condicional 1: si no hay nada, se muestra un mensaje en vez de la lista.
  if (items.length === 0) {
    return <p className="text-gray-500">No hay solicitudes todavía</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* map convierte cada dato en una tarjeta. La key va aquí, en lo que devuelve el map. */}
      {items.map((item) => (
        <TarjetaSolicitud
          key={item.id}
          titulo={item.titulo}
          cantidad={item.cantidad}
          fechaLimite={item.fechaLimite}
          estado={item.estado}
          cotizaciones={item.cotizaciones}
        />
      ))}
    </div>
  );
}
