import { exigirUsuario } from "@/services/auth";
import FormularioNombre from "@/components/perfil/FormularioNombre";
import { guardarNombre } from "./actions";

export const metadata = {
  title: "Mi perfil · Offero",
};

const NOMBRES_DE_ROL = {
  client: "Cliente",
  provider: "Proveedor",
  admin: "Administrador",
};

export default async function PaginaPerfil() {
  // Cualquier usuario con sesión. La página es dinámica porque lee la sesión (cookies).
  const usuario = await exigirUsuario();

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Mi perfil</h1>

      <div className="mt-8 flex flex-col gap-4">
        <FormularioNombre accion={guardarNombre} nombreActual={usuario.nombre} />

        <dl className="flex flex-col gap-4">
          <div>
            {/* El correo solo lo ve el dueño: esta página siempre muestra al usuario actual. */}
            <dt className="text-sm text-slate-400">Correo</dt>
            <dd className="font-medium">{usuario.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">Rol</dt>
            <dd className="font-medium">{NOMBRES_DE_ROL[usuario.role] ?? usuario.role}</dd>
          </div>
        </dl>
        <p className="text-xs text-slate-500">El rol no se puede cambiar desde aquí.</p>
      </div>
    </main>
  );
}
