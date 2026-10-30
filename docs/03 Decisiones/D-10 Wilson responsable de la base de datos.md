---
tags: [decision]
id: D-10
estado: Tomada
fecha: 2026-10-30
---
# D-10 · Wilson responsable de la base de datos

- **Estado:** Tomada
- **Decide:** Diego (PO)
- **Contexto:** toda la base de datos dependía de Diego (esquema, revisión del SQL y producción), uno de los riesgos más altos del plan (cuello de botella y factor bus). Wilson tiene un poco más de experiencia que el resto y sabe algo de JavaScript.
- **Decisión:**
  - Wilson es el **responsable de la base de datos**: cuida el esquema y las convenciones, revisa todo PR con SQL, lo aplica en offero-prod y mantiene [[Esquema de la base de datos]].
  - **Transición:** en el Sprint 0 aprende PostgreSQL; en el Sprint 1 revisa el SQL junto con Diego; desde el Sprint 2 lidera, con Diego de respaldo.
  - Iker sigue como revisor de seguridad (RLS). Un PR con SQL necesita la revisión de los dos.
  - La coordinación de documentación (esta bóveda) pasa a **Daniel**.
- **Alternativas:** Wilson con base de datos y documentación a la vez (descartada: lo dejaba sin margen de horas y obligaba a quitar el tiempo real de M5).
- **Motivo:** repartir la carga de Diego, tener dos personas que saben de la base de datos y aprovechar la experiencia de Wilson.
- **Consecuencias:** cambian los roles en las Partes 1, 2, 3, 6, 7 y 10 del plan y en las guías (v4). En GitHub: T0-24 cerrada (ya hecha), nuevas T0-33 y T1-20, T1-14 pasa al Sprint 2, nueva historia OFF-061. Carga aproximada: Diego ≈73 h de 93, Wilson ≈66 h de 76, Daniel ≈72 h de 76.

Relacionado: [[D-03 Dos proyectos de Supabase]] · [[D-04 RLS automático y revisión de vistas]] · [[Equipo]]

Volver a [[Registro de decisiones]]
