---
tags: [proyecto, auditoria]
fecha: 2026-11-11
estado: Aplicada en GitHub
---
# Auditoría del MVP (10 – 11 nov 2026)

Revisión completa de Offero para saber si vamos bien hacia un MVP que puedan probar usuarios reales, qué falta y cómo ordenar el trabajo. Ver también [[Visión y MVP]], [[Calendario]] y [[Contexto del proyecto]].

> **Resumen en cuatro líneas**
> - La base técnica está bien hecha, pero **ningún paso del flujo principal funciona todavía** en producción.
> - Avance hacia el MVP: **~15 %** (17 de 110 puntos de historias imprescindibles).
> - Faltaban 7 cosas que nadie había planeado (contacto entre las partes, recuperar contraseña, privacidad, errores, pruebas, comentarios, acuerdos de la base de datos). Ya son issues.
> - El trabajo quedó ordenado por prioridad: los Sprints 1 a 4 ahora solo tienen lo imprescindible.

## 1. Cómo se hizo
| Qué se revisó | Cómo | Resultado |
|---|---|---|
| Código (`main`, 11 nov) | Lectura de todos los archivos de `app-offero/src`, `npm run lint`, `npm run build`, `npm audit` | Sin errores ni vulnerabilidades |
| Producción | Peticiones a `app-offero.vercel.app` | Portada responde; `/login`, `/registro`, `/solicitudes` y `/administrador` dan 404 |
| Base de datos dev | Consultas a tablas, políticas, funciones y permisos; Security Advisor | 2 tablas, 6 políticas, 4 avisos |
| Planificación | Los 146 issues, 9 milestones, PRs y tablero | Ver secciones 5 y 6 |
| Documentación | Notas de `docs/` y decisiones D-01 a D-10 | Ver hallazgos |

**Lo que no se pudo revisar:** la base de datos de **producción** (offero-prod) no es accesible desde la herramienta de auditoría. Lo que se dice de prod sale de las capturas de Diego del 7 y 9 de noviembre. Tampoco se probaron las Previews de Vercel, que piden iniciar sesión.

## 2. Estado real

### El flujo principal de Offero
Offero es un mercado **al revés**: no se publican ofertas, se publican **necesidades**. Por eso el flujo de un usuario es este:

| # | Paso | Estado verificado | Historias |
|---|---|---|---|
| 1 | Registrarse como cliente o proveedor | ❌ No existe la página. La base sí está lista (perfil automático, rol protegido) | OFF-008 |
| 2 | Iniciar y cerrar sesión | ❌ No existe. Clientes de Supabase y proxy de sesión ya fusionados | OFF-009, OFF-010 |
| 3 | Perfil: el proveedor crea su negocio | ❌ Sin tabla ni página | OFF-014, OFF-015, OFF-016 |
| 4 | Publicar: el cliente publica una solicitud | ❌ Sin tabla ni página | OFF-022, OFF-023 |
| 5 | Explorar: el proveedor ve las solicitudes abiertas | ❌ | OFF-025 |
| 6 | Buscar: filtrar por categoría | ❌ `categories` existe solo en dev | OFF-013, OFF-025 |
| 7 | Detalle de la solicitud | ❌ | OFF-026 |
| 8 | Interactuar: cotizar, comparar, elegir y contactarse | ❌ El contacto ni siquiera estaba planeado | OFF-029 a OFF-034, OFF-062 |

**Pasos que funcionan de principio a fin: 0 de 8.**

### Mapa de progreso
| Área | Estado actual (verificado) | Prioridad | Trabajo pendiente |
|---|---|---|---|
| Frontend | Portada, Header y Footer. Sin navegación por rol | P0 | Todas las páginas del flujo |
| Backend | Clientes de Supabase y proxy de sesión. Ninguna Server Action | P0 | Formularios, servicios y validación en servidor |
| Base de datos | `profiles` con RLS en dev y prod. `categories` solo en dev y sin archivo en el repositorio | P0 | `businesses`, `requests`, `quotes` |
| Autenticación | Trigger de perfil y políticas probadas con 6 pruebas. Sin páginas | P0 | Registro, login, patrón por rol |
| Publicaciones (solicitudes) | Nada | P0 | Tabla, formulario, listas y detalle |
| Búsqueda y filtros | Nada | P0 por categoría · P2 por texto | OFF-025 |
| Interacción entre usuarios | Nada | P0 | Cotizar, comparar, elegir y contacto |
| Diseño responsive | La portada usa clases adaptables. Nunca se probó en celular | P0 | OFF-067 |
| Pruebas | Solo las pruebas de RLS de `profiles` | P0 | Lista de pruebas y prueba cruzada |
| Despliegue | Producción y Preview por PR funcionando | P0 | Mantener |

### Porcentaje de avance
**Método:** puntos de las historias P0 cerradas, divididos entre todos los puntos P0. Una historia solo cuenta si está cerrada **y** se comprobó en el código o en la base de datos.

- Cerradas y verificadas: **17 puntos** (todo el Sprint 0: proyecto, portada, Vercel, Supabase, `profiles`).
- P0 abiertas: **93 puntos** (33 historias, más OFF-007 que espera su prueba de sesión).
- **17 ÷ 110 = 15 %.**

Es un número honesto pero duro: mide producto terminado, no esfuerzo. El Sprint 0 fue casi todo preparación, y eso era lo correcto.

### Nivel de preparación técnica: bueno
- Stack simple y coherente: Next.js + Supabase + Vercel, sin servidor propio. No hace falta ninguna tecnología más para el MVP.
- Seguridad bien pensada desde el inicio: RLS, permisos por columna, rol que no se puede manipular, claves fuera del código.
- Flujo de trabajo sano: `main` protegida, un PR por tarea, SQL en archivos, dev y prod separados.

## 3. Lo que está bien hecho
1. **La seguridad se diseñó antes que las pantallas.** Es lo más difícil de arreglar después.
2. **El alcance ya tenía prioridades** (Must, Should, Could) y un hito intermedio realista: el núcleo el 6 de diciembre.
3. **Dos bases de datos separadas** y solo dos personas con acceso a producción.
4. **Documentación viva** en el mismo repositorio que el código.
5. **Todo el trabajo pasa por revisión** de otro integrante.

## 4. Problemas encontrados

### Críticos
| # | Problema | Qué se hizo |
|---|---|---|
| 1 | **El flujo se cortaba al elegir una cotización.** El núcleo termina el 6 dic y la mensajería llegaba en el Sprint 6 o 7. Cliente y proveedor no tenían cómo hablarse | D-11: se muestra el WhatsApp del negocio al elegir (OFF-062, T1-41) |
| 2 | **La sesión de diseño de la base de datos no dejó nada escrito.** «Acuerdos» vacío, 4 dudas sin decisión, 7 notas de tablas sin campos. Esta semana se crean 3 tablas | T1-40, urgente |

### Altos (antes de lanzar)
| # | Problema | Qué se hizo |
|---|---|---|
| 3 | No hay forma de recuperar una contraseña olvidada | OFF-063 |
| 4 | No hay aviso de privacidad ni términos, y habrá datos de empresas reales | OFF-065 |
| 5 | La app no tiene páginas de error, «no encontrado» ni carga | OFF-064 |
| 6 | La prueba cruzada (OFF-055) usa una lista de pruebas que no existe | OFF-067 |
| 7 | No hay forma de recibir comentarios de los usuarios del piloto | OFF-066 |
| 8 | Iker no tenía ninguna historia del flujo principal en los Sprints 1, 2 y 4; Diego cargaba 11 puntos en el 1 y en el 3 | Reorganización (sección 6) |

### Medios
| # | Problema | Qué se hizo |
|---|---|---|
| 9 | `next.config.mjs` tiene activado **Cache Components**. Toda página que lea la sesión necesita `<Suspense>` o no compila. Nadie lo había decidido | Comentario en T1-02 (#95): decidir antes de escribir el patrón |
| 10 | `rls_auto_enable()` se puede llamar por la API sin iniciar sesión | T2-14 |
| 11 | `categories` existe en dev sin archivo en `supabase/sql/`: la base y el repositorio no coinciden | Aviso en T1-20 (#117) |
| 12 | 0 entrevistas hechas. Las categorías reales (T1-07) dependen de ellas | Sigue en OFF-056; ver recomendaciones |
| 13 | D-06, D-07 y D-08 siguen como «Propuesta» | Incluido en T1-40 |
| 14 | Los proyectos gratuitos de Supabase pueden pausarse por inactividad, y hay dos semanas de descanso | OFF-068 |

### Bajos
- `globals.css` pone Arial en el `body` y anula la fuente Geist que carga `layout.js`.
- El modo oscuro cambia el fondo pero los componentes usan grises fijos: puede leerse mal.
- Hay actualizaciones menores de Next (16.4.6) y React (19.3.1). No urgen.
- No hay revisión automática de lint en los PR. La compilación de Vercel ya detecta lo grave.

### Problemas de planificación
- **Ritmo:** al 11 de noviembre el Sprint 1 tiene 0 tareas cerradas de 35. El Sprint 0 terminó dos días tarde.
- **Sin margen:** quedan menos de 4 semanas para el núcleo, y la semana siguiente es de exámenes finales.
- **Camino crítico en una persona:** el patrón de autenticación, el registro, cotizar y elegir son todos de Diego.

## 5. Funcionalidades del MVP

### P0 · Imprescindibles (33 historias, 90 puntos)
Sin esto no se puede lanzar.
- **Cuenta:** registro con rol, inicio y cierre de sesión, páginas protegidas, recuperar acceso.
- **Proveedor:** crear y editar mi negocio, con su contacto.
- **Cliente:** publicar una solicitud y ver mis solicitudes.
- **Encuentro:** ver solicitudes abiertas, filtrar por categoría, ver el detalle.
- **Cotización:** enviar, ver las mías, comparar, elegir (todo cambia a la vez), ver el estado.
- **Cierre:** ver el contacto del negocio elegido.
- **Calidad:** páginas de error, lista de pruebas, prueba cruzada, privacidad, comentarios del piloto, revisión de seguridad.

### P1 · Importantes, después del flujo principal (13 historias, 37 puntos)
Mensajería mínima dentro de la solicitud, reseñas, directorio de negocios, ver y editar mi perfil, proteger `/administrador`, ocultar contenido, editar o cancelar una solicitud.

### P2 · Fuera de la primera versión (14 historias, 44 puntos)
Reportes de contenido, lista de usuarios, administrar categorías desde la app, cambiar roles, suspender cuentas, logo del negocio, búsqueda por texto, bandeja de mensajes, contador de no leídos, mensajes en tiempo real, promedio de reseñas, editar reseñas, inicio con Google.

**Regla:** una P1 o P2 no se empieza si hay una P0 de ese sprint sin terminar.

## 6. Cambios aplicados en GitHub
1. **Etiquetas `P0`, `P1` y `P2`** en las 60 historias abiertas. Las etiquetas `must`, `should` y `could` se conservan.
2. **10 issues nuevos:** T1-40 (#171), T1-41 (#172), T2-14 (#173), OFF-062 (#174), OFF-063 (#175), OFF-064 (#176), OFF-065 (#177), OFF-066 (#178), OFF-067 (#179) y OFF-068 (#180).
3. **Reorganización autorizada por Diego el 11 nov:**

| Cambio | Antes | Ahora | Motivo |
|---|---|---|---|
| OFF-024 · Ver mis solicitudes | Wilson | **Iker** | Wilson tenía 4 historias P0 en el Sprint 3; Iker ninguna |
| OFF-045 y T1-15 · `/administrador` protegido | Sprint 1 | Sprint 6 | La administración no es del flujo principal |
| OFF-012 · Cuenta admin en producción | Sprint 2 | Sprint 6 | Se comprueba entrando a `/administrador` |
| OFF-050 · Ocultar o mostrar contenido | Sprint 4 | Sprint 7 | P1. Las columnas `is_hidden` sí se crean ahora |
| OFF-046, T1-16 y T1-18 · Reportar contenido | Sprints 1 y 2 | Sprint 8 | P2. La tabla `reports` no se crea todavía |
| OFF-047, OFF-048 y OFF-049 · Categorías, usuarios y reportes en el panel | Sprints 2 y 3 | Sprint 8 | P2 |
| OFF-051 · Cambiar rol | Sprint 7 | Sprint 8 | Depende de OFF-048 |
| OFF-017 y OFF-018 · Directorio y detalle de negocios | Sprint 3 | Sprint 6 | P1. OFF-018 depende de OFF-017 |

4. **Mensajería (M5):** no cambió de sprint, pero queda como P1. El contacto del MVP es OFF-062.
5. **No se tocó:** el Sprint 0, el código, ni el estado de ninguna tarea. No se cerró ni se borró nada.

**Queda por registrar como decisión (lo escribe Diego):** D-11 (contacto por WhatsApp), D-12 (Cache Components) y el cambio al reparto de módulos de D-01.

## 7. Hoja de ruta

| Etapa | Sprints | Fechas |
|---|---|---|
| Preparación y arquitectura | 0 ✅ y 1 | hasta el 15 nov |
| Funcionalidades principales, con su base de datos | 2 y 3 | 16 – 29 nov |
| Integración del flujo completo | 4 | 30 nov – 6 dic |
| Pruebas y correcciones | 5 | 7 – 13 dic |
| Lanzamiento del piloto | 4 a 6 | desde el 6 dic |
| Funcionalidades P1 | 6 y 7 | 14 dic – 15 ene |
| Seguridad final y entrega | 8 | 18 – 29 ene |

### Sprint 1 · 9 – 15 nov · Cuentas y primeras tablas
- **Objetivo:** que una persona pueda registrarse e iniciar sesión, y que existan las tres primeras tablas protegidas.
- **Resultado esperado:** registro, login y cierre de sesión funcionando en producción; `categories`, `businesses` y `requests` en dev y prod.
- **Issues (todos P0):** OFF-008, OFF-009, OFF-010, OFF-013, OFF-014, OFF-022, OFF-056 · tareas T1-01 a T1-12, T1-17, T1-19, T1-20, **T1-40 y T1-41** · prácticas React 1 a 4 y Next 1.
- **Dependencias:** T1-40 y T1-41 van **antes** de crear `businesses` y `requests`. T1-02 (patrón) va antes de T1-04 (registro). T1-06 (`categories`) va antes de T1-11 (`requests`). T1-07 necesita la lista de categorías del PO.
- **Completado cuando:** dos cuentas de roles distintos entran en producción · cada tabla tiene su archivo SQL en `main`, su nota llena y la revisión de Iker · D-11 está escrita.
- **Riesgo:** va atrasado. Si no alcanza, lo primero que se corre es la práctica Next 1; después, T1-04 pasa a los primeros días del Sprint 2. Las tablas no se corren.

### Sprint 2 · 16 – 22 nov · Crear negocio y publicar solicitud
- **Objetivo:** que el proveedor cree su negocio y el cliente publique su primera solicitud.
- **Resultado esperado:** los dos formularios guardan datos reales en producción.
- **Issues:** P0: OFF-015, OFF-016, OFF-023, OFF-029, OFF-063 · tareas T1-10, T1-13, T1-14, T2-14 · prácticas Next 2 a 4 · P1: OFF-011.
- **Dependencias:** OFF-015 necesita el campo de contacto de D-11 y el servicio T1-10. OFF-023 necesita T1-13. Todos los formularios usan el patrón de OFF-010.
- **Completado cuando:** un proveedor crea y edita su negocio y un cliente publica una solicitud, en producción y probados por otra persona · `quotes` existe en dev y prod · el procedimiento para recuperar el acceso está escrito y probado.

### Sprint 3 · 23 – 29 nov · Explorar y cotizar
- **Objetivo:** que un proveedor encuentre una solicitud y envíe la primera cotización.
- **Resultado esperado:** primera cotización real enviada entre dos cuentas distintas.
- **Issues (todos P0):** OFF-024 (Iker), OFF-025, OFF-026, OFF-028, OFF-030, OFF-031, OFF-032, OFF-057, OFF-064, OFF-065.
- **Dependencias:** OFF-026 depende de OFF-024. OFF-030 depende de OFF-029 y OFF-026. OFF-065 debe estar antes de la primera empresa real (OFF-057).
- **Completado cuando:** el proveedor A ve la solicitud, cotiza y no ve la cotización del proveedor B · el cliente ve las dos y las ordena · existen las páginas de error y el aviso de privacidad.

### Sprint 4 · 30 nov – 6 dic · Elegir y cerrar el ciclo — **núcleo**
- **Objetivo:** que el cliente elija una cotización y pueda contactar al proveedor.
- **Resultado esperado:** el flujo completo funciona en producción con empresas reales.
- **Issues:** P0: OFF-033, OFF-034, OFF-019, OFF-062, OFF-066, OFF-067 · P1: OFF-027.
- **Dependencias:** OFF-062 depende de OFF-033 y del campo de contacto. OFF-067 necesita el flujo casi completo.
- **Completado cuando:** al elegir, los tres estados cambian a la vez · el cliente ve el WhatsApp del negocio · hay 2 compradores y 2 proveedores reales registrados · la lista de pruebas se recorrió una vez completa.

### Sprint 5 · 7 – 13 dic · Probar y corregir (semana de finales)
- **Objetivo:** encontrar y corregir los errores antes de que los encuentren las empresas.
- **Issues:** P0: OFF-055 y los bugs que salgan · P1 solo si no hay errores críticos: OFF-035, OFF-041.
- **Completado cuando:** cada módulo lo probó alguien que no lo hizo · el flujo se probó en un celular real · no queda ningún error crítico conocido.
- **Aquí el MVP está listo para su primera prueba con usuarios.**

### Sprint 6 · 14 – 18 dic · Uso real
- **Objetivo:** acompañar el uso real y dejar todo listo para el descanso.
- **Issues (P1):** OFF-068, OFF-012, OFF-045, OFF-017, OFF-018, OFF-036, OFF-042.
- **Completado cuando:** hay consultas para medir H1, H2 y H3 · hay turnos para mantener producción activa · los comentarios del piloto se revisaron al menos una vez.

### Sprint 7 · 4 – 15 ene · Versiones mínimas de mensajería, reseñas y administración
- **Issues:** P1: OFF-038, OFF-050 · P2 solo si sobra tiempo.
- **Completado cuando:** las P1 funcionan en producción. Lo que no esté, se deja fuera sin culpa.

### Sprint 8 · 18 – 29 ene · Seguridad final y entrega
- **Issues:** P0: OFF-058, OFF-059 · el resto es P2.
- **Completado cuando:** revisión de seguridad hecha · código congelado el 22 de enero · presentación ensayada.

### Carga después de la reorganización
| Sprint | Diego | Daniel | Wilson | Iker |
|---|---|---|---|---|
| 1 (horas de tareas) | 13.15 de 14 | 10.25 de 12 | 11.55 de 12 | **6.75 de 12** |
| 2 (puntos) | 6 | 7 | 5 | **0** |
| 3 (puntos) | **11** | 2 | 7 | 7 |
| 4 (puntos) | 7 | 6 | 3 | **0** |

**Para decidir en la Planning** (no se aplicó, porque cambia de quién es cada módulo):
- **Sprint 1:** Iker tiene 5 horas libres. Puede probar el registro y el login de Diego (T1-04), adelantar el borrador de privacidad (OFF-065) o tomar las pruebas de permisos de `requests` (T1-12).
- **Sprint 2:** Iker toma OFF-016 (editar mi negocio) de Daniel.
- **Sprint 3:** Daniel toma OFF-032 (comparar cotizaciones) de Diego: es sobre todo interfaz.
- **Sprint 4:** Iker hace la parte de permisos de OFF-067 y toma OFF-034.

## 8. Plan de pruebas
Sin herramientas nuevas hasta terminar el núcleo. Todo esto se puede hacer con lo que ya tienen.

| Tipo de prueba | Cómo | Quién | Cuándo |
|---|---|---|---|
| Compilación y estilo | `npm run lint` y `npm run build` antes de cada PR; Vercel compila cada Preview | Quien hace el PR | Siempre |
| Formularios y validaciones | En el Preview: campos vacíos, valores fuera de rango, doble clic. Después lo mismo manipulando el formulario con F12, para probar el servidor | Autor y revisor | Cada PR con formulario |
| Navegación y rutas | Abrir cada ruta con sesión, sin sesión y con un id que no existe | Autor | Cada PR con página |
| Autenticación y permisos | Dos cuentas de roles distintos en el Preview, y pruebas de RLS con `begin` / `rollback` (README, «Cómo probar las políticas») | Autor e Iker | Cada tabla o página protegida |
| Integración (flujo completo) | Lista de pruebas de OFF-067: registro → negocio → solicitud → cotización → elegir → contacto, con las 4 cuentas de prueba de dev | Daniel coordina | Fin de los Sprints 4 y 5 |
| Responsive | Modo responsive del navegador a 375 px y un celular real | Daniel | Con OFF-067 |
| Errores y casos extremos | Botón Atrás después de cerrar sesión, enlaces de otro usuario, textos muy largos, fechas pasadas | Iker | Con OFF-067 |
| Prueba cruzada | Cada módulo lo prueba alguien que no lo hizo, en producción (OFF-055) | Todos | Sprint 5 |
| Seguridad | Security Advisor después de cada tabla (T2-14) y revisión final (OFF-058) | Iker y Wilson | Continuo y Sprint 8 |

**Después del núcleo** se puede evaluar una sola prueba automática del camino feliz. Pruebas de componentes: no hacen falta para este tamaño de proyecto.

## 9. Aprendizaje
- Ya existe la ruta de 8 prácticas por persona (React 1 a 4 y Next 1 a 4, etiqueta `aprendizaje`).
- Cada issue nuevo trae la sección **«Para comprobar que lo entiendes»**: preguntas que se responden en el PR.
- **Hueco que queda:** guardar datos con Server Actions. Recomendación: en la Planning del Sprint 2, que la primera tarea de formulario de cada uno sea en pareja con Wilson o Diego (así lo dice la tabla «A quién preguntar» de [[Equipo]]).

## 10. Recomendaciones

**Hacer ya (esta semana)**
1. T1-40: escribir los acuerdos de la base de datos. Sin esto no se crea ninguna tabla más.
2. T1-41: escribir D-11 y acordar con Daniel el campo de contacto antes de `businesses`.
3. T1-02: el patrón de autenticación. Es lo que más gente tiene esperando.
4. Daniel: subir el archivo SQL de `categories`, que ya está en dev.
5. Diego: entregar la lista de categorías reales, aunque sea provisional. No esperar a las 5 entrevistas.

**Evitar**
- Empezar una P1 o P2 «porque es rápida».
- Crear tablas sin su nota llena.
- Agregar librerías: no hace falta ninguna para el MVP.
- Más reorganizaciones de planeación. El plan ya es suficiente; ahora falta producto.

**Decisiones técnicas pendientes**
- D-11: contacto por WhatsApp (ya elegida, falta escribirla).
- D-12: mantener o desactivar Cache Components.
- Recuperación de contraseña para el piloto (OFF-063).

**Para publicar y probar el MVP hace falta**
Las 33 historias P0, las empresas del piloto invitadas desde ya (OFF-057 no puede empezar en el Sprint 3 desde cero) y alguien que avise a los proveedores cuando haya una solicitud nueva: la app no envía notificaciones, y sin eso la hipótesis H2 no se puede cumplir.

## 11. Evaluación final
1. **¿Vamos por buen camino?** En lo técnico, sí. En el ritmo, no: hay más planeación que producto.
2. **¿Es realmente un MVP?** Ahora sí. Antes, los primeros sprints mezclaban el flujo principal con administración y reportes.
3. **¿Qué es lo que más falta?** Software que funcione. Hoy no hay ni una pantalla donde un usuario pueda hacer algo.
4. **¿Qué puede hacernos fracasar?** Que todo dependa de Diego, crear tablas que no encajan, y llegar al 6 de diciembre sin empresas reales listas para probar.
5. **¿Siguiente paso?** T1-40 y T1-41 hoy; T1-02 mañana. Y la próxima semana, medir el avance por pantallas que funcionan en producción, no por issues cerrados.
