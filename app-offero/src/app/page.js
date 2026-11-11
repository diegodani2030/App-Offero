const pasos = [
  {
    titulo: "Publica tu solicitud",
    texto: "Describe lo que necesitas, tu presupuesto y cuándo lo quieres.",
  },
  {
    titulo: "Recibe cotizaciones",
    texto: "Los proveedores de Bogotá te envían sus ofertas.",
  },
  {
    titulo: "Compara y elige",
    texto: "Revisa precio, tiempo de entrega y condiciones, y escoge la mejor.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Publica lo que necesitas y recibe cotizaciones
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-500">
        Cuéntanos qué buscas y proveedores de Bogotá te envían sus ofertas.
        Compara precio, tiempo de entrega y condiciones antes de decidir.
      </p>
      <section id="como-funciona" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold">¿Cómo funciona?</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {pasos.map((paso, i) => (
            <li key={paso.titulo}>
              <p className="text-sm font-semibold text-gray-500">Paso {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{paso.titulo}</h3>
              <p className="mt-2 text-gray-500">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}