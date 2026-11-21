import { createClient } from "@/lib/supabase/server";
import { exigirUsuario } from "@/services/auth";
import RequestForm from "@/components/requests/RequestForm";

export const metadata = {
  title: "Nueva solicitud · Offero",
};

export default async function PaginaNuevaSolicitud() {
  // Solo los clientes publican solicitudes (README, «Autenticación»).
  await exigirUsuario(["client"]);

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

  // Hoy en Bogotá como AAAA-MM-DD ("en-CA" da ese formato). Se calcula aquí, en el servidor,
  // y no en el navegador, para que servidor y navegador usen la misma fecha.
  const hoyEnBogota = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Publica lo que necesitas</h1>
      <p className="mt-2 text-slate-400">
        Los proveedores de Bogotá verán tu solicitud y te enviarán sus cotizaciones.
      </p>
      <RequestForm categorias={ordenadas} fechaMinima={hoyEnBogota} />
    </main>
  );
}
