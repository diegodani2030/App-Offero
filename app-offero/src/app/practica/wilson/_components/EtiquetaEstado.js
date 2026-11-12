const textos = {
  open: "Abierta",
  awarded: "Adjudicada",
  cancelled: "Cancelada",
};

const colores = {
  open: "bg-green-100 text-green-800",
  awarded: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function EtiquetaEstado({ estado }) {
  return (
    <span className={`rounded px-2 py-1 text-sm ${colores[estado]}`}>
      {textos[estado]}
    </span>
  );
}