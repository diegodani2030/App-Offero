import Link from "next/link";

// Next 2: lo que se ve cuando la página llama notFound() (un id que no existe).
export default function SolicitudNoEncontrada() {
  return (
    <main>
      <h1 className="text-2xl font-bold">No encontramos esa solicitud</h1>
      <p className="mt-2 text-gray-500">Puede que el enlace esté mal escrito o que la solicitud ya no exista.</p>
      <Link href="/practica/wilson/solicitudes" className="mt-4 inline-block text-blue-600 hover:underline">
        ← Volver a mis solicitudes
      </Link>
    </main>
  );
}
