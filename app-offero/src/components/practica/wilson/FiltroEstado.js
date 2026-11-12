// Hijo sin estado propio: recibe el valor actual y una función para avisarle al padre.
const opciones = [
  { valor: "todas", texto: "Todas" },
  { valor: "open", texto: "Abiertas" },
  { valor: "awarded", texto: "Adjudicadas" },
  { valor: "cancelled", texto: "Canceladas" },
];

export default function FiltroEstado({ valor, onCambiar }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          // Se pasa una función flecha: onCambiar se llama solo al hacer clic.
          onClick={() => onCambiar(opcion.valor)}
          className={`rounded px-3 py-1 text-sm ${
            valor === opcion.valor
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  );
}
