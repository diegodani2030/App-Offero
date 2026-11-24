---
tags: [decision]
id: D-14
estado: Tomada
fecha: 2026-11-24
---
# D-14 · Recuperar contraseñas a mano durante el piloto

- **Estado:** Tomada (24 nov 2026) · OFF-063 (#175)
- **Decide:** Daniel, cubriendo a Diego (PO) mientras está incapacitado. La opción es la mínima que recomendaba el propio issue; Diego la puede cambiar cuando vuelva.
- **Contexto:** No hay forma de recuperar una contraseña olvidada. El correo incluido en Supabase envía 2 correos por hora y solo a miembros de la organización ([[D-09 Correos de confirmación|D-09]]), así que el enlace normal de «olvidé mi contraseña» no les llegaría a los usuarios del piloto.
- **Decisión:** Durante el piloto, un integrante del equipo restablece la contraseña a mano en offero-prod después de confirmar la identidad del usuario, le entrega una contraseña temporal por un canal privado y el usuario la cambia en `/perfil/contrasena`. El procedimiento está en [[Recuperar el acceso a una cuenta]].
- **Alternativas:**
  - Flujo automático por correo con un SMTP propio (Resend, Brevo…): es lo correcto a largo plazo, pero es más configuración y más puntos de fallo antes del núcleo.
  - Enlace mágico de Supabase: tiene el mismo problema de correo que D-09.
- **Motivo:** Resuelve el problema real del piloto (pocos usuarios, que el equipo conoce) sin código de correo ni servicios nuevos.
- **Consecuencias:**
  - En `/login` se muestra a quién escribir; en `/perfil/contrasena` el usuario cambia la temporal.
  - Depende de que alguien del equipo responda: el objetivo es menos de un día.
  - **P1 para después del núcleo:** flujo automático «olvidé mi contraseña» por correo con un SMTP propio (revisar junto con D-09 antes del uso real, Sprint 6).

Volver a [[Registro de decisiones]]
