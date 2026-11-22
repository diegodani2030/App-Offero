---
tags: [aprendizaje]
fecha: 2026-11-22
autor: Wilson
tema: supabase / nextjs
---
# El login fallaba: URL de Supabase en .env.local

**Qué pasó:** Mientras probaba `requests.js` (T1-13), no podía entrar con ninguna cuenta. Al registrarme me decía que el correo ya estaba registrado, y al iniciar sesión fallaba aunque pusiera bien la contraseña. Creí que era la contraseña o la cuenta, y perdí más de una hora con eso.

**Por qué pasó:** En `app-offero/.env.local`, la variable `NEXT_PUBLIC_SUPABASE_URL` tenía el enlace del **panel** de Supabase (el que se copia del navegador, `supabase.com/dashboard/project/...`) y no la **URL de la API** del proyecto (`https://<ref>.supabase.co`). La app mandaba el login a una dirección que no es la API, así que fallaba con cualquier cuenta. Las cuentas sí existían en Supabase (se veían en Authentication → Users).

**Cómo se resolvió:**
1. Revisé en Authentication → Users que las cuentas existían. Eso descartó la contraseña como causa.
2. Cambié solo la línea de la URL en `.env.local` por la de Project Settings → API (`https://<ref>.supabase.co`). No toqué ni mostré la clave.
3. Reinicié `npm run dev`, porque las variables de `.env.local` solo se leen al arrancar.
4. Entré sin problema.

**Cómo evitarlo:**
- La URL se copia de **Project Settings → API**, no de la barra del navegador. Tiene que terminar en `.supabase.co`.
- Si el login falla con **todas** las cuentas, el problema no es la contraseña: revisa primero `.env.local`.
- Después de cambiar `.env.local`, reinicia el servidor.
- Las claves de `.env.local` nunca se pegan en el chat, en Obsidian ni en un commit (el archivo está en `.gitignore`).

**Otras cosas que me costaron en la ruta:**
- **Aplicar SQL en prod:** `requests` falló con `relation "public.categories" does not exist` porque en prod todavía no estaba `categories`. Hay que aplicar las tablas en el orden de sus llaves foráneas y revisar prod antes de ejecutar.
- **Código viejo después de cambiar de rama:** con el repo en OneDrive, el servidor de desarrollo a veces seguía mostrando la rama anterior. Se arregló reiniciando `npm run dev`.

Relacionado: [[Aprendizaje MOC]], [[Contrato de autenticación (sesión T1-03)]]
