# Offero

Offero es una plataforma web que conecta a personas y empresas que necesitan productos o servicios con negocios y proveedores que pueden ofrecerlos. Los compradores publican solicitudes y reciben cotizaciones que pueden comparar según precio, tiempo de entrega y condiciones.

Stack: Next.js (App Router, JavaScript) · React · Tailwind CSS · Supabase · Vercel.

## Requisitos

- Windows 10 u 11 con PowerShell y Visual Studio Code.
- Node.js LTS: `winget install OpenJS.NodeJS.LTS`
- Git: `winget install Git.Git`
- Permitir scripts de npm (una sola vez): `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Después de instalar Node y Git, cierra y vuelve a abrir PowerShell.

## Instalación en Windows

1. Clona el repositorio **fuera de OneDrive** (por ejemplo en `C:\dev`):

   ```powershell
   mkdir C:\dev
   cd C:\dev
   git clone https://github.com/diegodani2030/App-Offero.git
   ```

2. Entra a la carpeta del proyecto e instala las dependencias. Todos los comandos `npm` se ejecutan dentro de `app-offero`:

   ```powershell
   cd C:\dev\App-Offero\app-offero
   npm install
   ```

3. Crea tu archivo de variables de entorno a partir del ejemplo:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Abre `.env.local` y llena los valores que Diego te envía por mensaje privado. Este archivo nunca se sube a GitHub.

4. Corre la aplicación y abre http://localhost:3000 en el navegador:

   ```powershell
   npm run dev
   ```

## Estructura del repositorio

- `app-offero/`: el proyecto de Next.js. Las páginas están en `src/app/` (cada carpeta es una ruta) y los componentes en `src/components/`.
- `docs/`: la bóveda de Obsidian con la documentación del equipo.
- `supabase/sql/`: los cambios de la base de datos, un archivo por cambio (se crea con la primera tabla).
- `.github/`: plantillas de pull requests e issues.

## Cómo trabajamos

1. Toma una tarea del tablero y muévela a «En curso».
2. Actualiza `main` y crea tu rama: `git switch main`, `git pull`, `git switch -c tipo/mN-descripcion` (tipos: `feat`, `fix`, `chore`, `docs`).
3. Haz commits pequeños con el formato `tipo(módulo): qué hace`.
4. Sube tu rama con `git push -u origin nombre-de-tu-rama` y abre un pull request hacia `main` usando la plantilla. Escribe «Cierra #N» para enlazar la tarea.
5. Un compañero revisa y Diego fusiona.

Nunca hagas commits directos a `main` ni subas `.env.local`, `node_modules` o claves.

Más detalles en [Cómo usar esta bóveda](<docs/Cómo usar esta bóveda.md>).