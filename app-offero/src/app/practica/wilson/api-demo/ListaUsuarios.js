// Next 4: componente de SERVIDOR async que trae datos de una API pública.
// El fetch corre en el servidor: el navegador recibe la lista ya armada.
const URL_BUENA = "https://jsonplaceholder.typicode.com/users";
// Para probar error.js: una ruta que no existe en esa API (responde 404).
const URL_ROTA = "https://jsonplaceholder.typicode.com/no-existe";

export default async function ListaUsuarios({ roto = false }) {
  const respuesta = await fetch(roto ? URL_ROTA : URL_BUENA);

  // Si la respuesta no es correcta, se lanza un error y Next muestra error.js.
  if (!respuesta.ok) {
    throw new Error(`La API respondió ${respuesta.status}`);
  }

  const usuarios = await respuesta.json();

  if (usuarios.length === 0) {
    return <p className="text-gray-500">La API no devolvió usuarios.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {usuarios.map((u) => (
        <li key={u.id} className="rounded-lg border border-gray-300 p-3">
          <span className="font-semibold">{u.name}</span>
          <span className="text-gray-500"> · {u.address.city}</span>
        </li>
      ))}
    </ul>
  );
}
