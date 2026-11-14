import { exigirUsuario } from "@/services/auth";

export const metadata = {
  title: "Mi perfil · Offero",
};

const NOMBRES_DE_ROL = {
  client: "Cliente",
  provider: "Proveedor",
  admin: "Administrador",
};

export default async function PaginaPerfil() {

  const usuario = await exigirUsuario();

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Mi perfil</h1>

      <dl className="mt-8 flex flex-col gap-4">
        <div>
          <dt className="text-sm text-slate-400">Nombre</dt>
          <dd className="font-medium">{usuario.nombre}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Correo</dt>
          <dd className="font-medium">{usuario.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-400">Rol</dt>
          <dd className="font-medium">{NOMBRES_DE_ROL[usuario.role] ?? usuario.role}</dd>
        </div>
      </dl>
    </main>
  );
}