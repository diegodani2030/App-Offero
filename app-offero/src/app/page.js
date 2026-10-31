import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function EstadoConexion() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  return (
    <p>
      {error
        ? `Error: ${error.message}`
        : "Conexión con Supabase correcta ✅"}
    </p>
  );
}

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Offero</h1>
      <Suspense fallback={<p>Comprobando conexión...</p>}>
        <EstadoConexion />
      </Suspense>
    </main>
  );
}