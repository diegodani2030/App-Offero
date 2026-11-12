---
tags: [decision]
id: D-11
estado: Tomada
fecha: 2026-11-11
---
# D-11 · Contacto entre cliente y proveedor

- **Estado:** Tomada (11 nov 2026)
- **Decide:** Diego (PO), después de la [[Auditoría del MVP (nov 2026)|auditoría del MVP]]
- **Contexto:** El núcleo termina cuando el cliente elige una cotización (dom 6 dic), pero la mensajería ([[M5 Mensajería]]) llega en el Sprint 6 o 7. Sin otro mecanismo, cliente y proveedor no tienen cómo hablarse justo cuando empieza el negocio real.
- **Decisión:**
  1. Cada negocio registra un **número de WhatsApp de contacto**, **obligatorio** al crear el negocio.
  2. **Solo lo ve el cliente que eligió una cotización de ese negocio**, y solo después de elegirla. También lo ve el dueño del negocio (para editarlo). Nadie más: ni otros clientes, ni otros proveedores, ni visitantes.
  3. El cliente lo ve en su solicitud adjudicada, con un botón que abre WhatsApp (OFF-062, #174).
  4. La mensajería interna (M5) queda como **P1**: se hace después del núcleo.
- **Alternativas:**
  - Que cualquier usuario con sesión vea el número: más simple, pero los clientes se saltarían Offero y los negocios recibirían mensajes no deseados.
  - Esperar a la mensajería interna: 5 historias y una tabla más antes del piloto.
- **Motivo:** Es lo mínimo que cierra el flujo principal a tiempo para el piloto, sin construir un chat. Mostrarlo solo al elegir protege a los negocios y obliga a comparar dentro de Offero.
- **Consecuencias:**
  - **Base de datos:** el número **no va como columna de `businesses`**, porque esa tabla la pueden leer todos. Va en una tabla aparte, `business_contacts` (`business_id` como clave primaria y foránea, `whatsapp`), con RLS por fila. Así cada regla de «quién lo ve» es una política, igual que en las demás tablas.
  - **Sprint 1 (Daniel, T1-08):** crea `business_contacts` junto con `businesses`, con políticas solo para el **dueño** (ver, crear, editar). Formato: 10 dígitos, celular colombiano (empieza por 3), validado con `CHECK` y otra vez en el servidor.
  - **Sprint 2 (Daniel, OFF-015):** el formulario «Crear mi negocio» guarda el negocio y su número en la misma Server Action; sin número no se crea el negocio.
  - **Sprint 4 (OFF-062):** se agrega la política para que el cliente que eligió lo vea. Usa `quotes` y `requests`, que todavía no existen; por eso no se escribe ahora.
  - El número de WhatsApp de un negocio es un dato de contacto que hay que mencionar en el aviso de privacidad (OFF-065).
  - Lo que pase en WhatsApp queda por fuera de Offero: no podemos medir si se cerró el negocio. Se pregunta en los comentarios del piloto (OFF-066).

Volver a [[Registro de decisiones]]
