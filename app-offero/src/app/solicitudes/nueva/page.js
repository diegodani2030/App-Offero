import { createClient } from "@/lib/supabase/server";
import { hoyEnBogota } from "@/lib/fechas";
import { exigirUsuario } from "@/services/auth";
import RequestForm from "@/components/requests/RequestForm";
import { publicarSolicitud } from "./actions";

export const metadata = {
  title: "Nueva solicitud · Offero",
};

export default async function PaginaNuevaSolicitud({ searchParams }) {
  // Solo los clientes publican solicitudes (README, «Autenticación»).
  await exigirUsuario(["client"]);
  // La Server Action vuelve aquí con ?creada=<id> después de publicar.
  const { creada } = await searchParams;

  // Categorías reales para el selector. Cuando exista el servicio de categorías
  // de Daniel (T1-10), esta consulta se cambia por su función.
  const supabase = await createClient();
  const { data: categorias, error } = await supabase
    .from("categories")
    .select("id, code, name")
    .order("name");
  if (error) console.error("nueva solicitud: no se pudieron leer las categorías:", error.message);

  // "Otros" (código Otr..) va al final de la lista: es la opción de "ninguna de las anteriores".
  const ordenadas = [...(categorias ?? [])].sort(
    (a, b) => Number(a.code.startsWith("Otr")) - Number(b.code.startsWith("Otr")),
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Publica lo que necesitas</h1>
      <p className="mt-2 text-slate-400">
        Los proveedores de Bogotá verán tu solicitud y te enviarán sus cotizaciones.
      </p>
      {creada && (
        <p role="status" className="mt-6 rounded-md border border-green-700 bg-green-950 p-3 text-sm text-green-200">
          ¡Listo! Tu solicitud quedó publicada y los proveedores ya la pueden ver.
        </p>
      )}
      {/* key: cuando se publica una, el formulario vuelve a empezar vacío. */}
      <RequestForm
        key={creada ?? "nueva"}
        accion={publicarSolicitud}
        categorias={ordenadas}
        fechaMinima={hoyEnBogota()}
      />
    </main>
  );
}
