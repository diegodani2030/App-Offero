---
tags: [decision]
id: D-09
estado: Tomada
fecha: 2026-10-29
---
# D-09 · Correos de confirmación

- **Estado:** Tomada (6 nov 2026)
- **Decide:** Diego (PO)
- **Contexto:** El correo incluido en Supabase envía 2 correos por hora y solo llega a miembros de la organización.
- **Decisión:** Desactivar «Confirm email» en offero-dev y offero-prod durante el MVP.
- **Alternativas:** Dejarlo activo con un SMTP propio gratuito (más real, pero más configuración y más puntos de fallo).
- **Motivo:** No bloquear el registro (T1-04) y evitar un estado «pendiente de confirmar» en el MVP.
- **Consecuencias:**
  - El usuario entra apenas se registra; T1-04 se construye con eso en mente.
  - Se pueden crear cuentas con correos falsos o ajenos.
  - Cualquier otro correo de Auth, como recuperar contraseña, tampoco llegaría a usuarios reales sin SMTP propio.
  - Revisar antes del uso real (Sprint 6); si hace falta, pasar a SMTP propio.

Volver a [[Registro de decisiones]]
