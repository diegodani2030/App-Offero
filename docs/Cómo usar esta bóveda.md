---
tags: [inicio]
---
# Cómo usar esta bóveda

> Guía para todo el equipo: qué es Obsidian, cómo se usa, por qué nos sirve en Offero y cómo guardar los cambios.

## Contenido
- [[#Abrirla por primera vez]]
- [[#Cómo se usa Obsidian]]
- [[#Beneficios para Offero]]
- [[#Ejemplo de uso real]]
- [[#Lo que NO es]]
- [[#Reglas del equipo]]
- [[#Cómo guardar los cambios (Git)]]
- [[#Qué escribe cada uno]]

---

## Abrirla por primera vez
1. Instala Obsidian (obsidian.md) en Windows. En el instalador elige **«Solo para mí»** y deja lo demás por defecto.
2. Ten el repositorio clonado en `C:\dev\App-Offero` (Anexo B de tu guía) y actualizado:
   ```powershell
   cd C:\dev\App-Offero
   git switch main
   git pull
   ```
3. En Obsidian: **Abrir carpeta como bóveda** → elige `C:\dev\App-Offero\docs`.
4. Si pregunta si confías en el autor, di que **sí**. No hace falta instalar plugins de la comunidad.
5. Abre la nota [[00 Inicio]] (también está en **Marcadores**, en el panel izquierdo).

---

## Cómo se usa Obsidian

### 1. La pantalla tiene tres zonas
- **Izquierda:** explorador de archivos (`01 Proyecto`, `02 Módulos`…). Son carpetas normales de tu disco.
- **Centro:** la nota que estás leyendo o escribiendo.
- **Derecha:** **enlaces entrantes** (qué notas apuntan a esta), **esquema** (títulos de la nota) y **etiquetas**.

### 2. Escribir es Markdown (lo mismo que GitHub y los PR)
| Escribes | Se ve como |
|---|---|
| `# Título` | Título grande |
| `**negrita**` | **negrita** |
| `- punto` | Lista |
| `- [ ] tarea` | Casilla para marcar |
| `` `código` `` | `código` |
| `\| col \| col \|` | Tabla |

Con **Ctrl + E** cambias entre modo edición y modo lectura.

### 3. Los enlaces son la clave
- Escribe `[[` y Obsidian te sugiere notas. Ejemplo: `[[M3 Solicitudes]]`.
- Si enlazas una nota que no existe (por ejemplo `[[Entrevista Pedraza]]`), al hacer clic se crea.
- Para enlazar a un título dentro de una nota: `[[Equipo#A quién preguntar]]`.

### 4. Atajos que vas a usar todo el día
| Atajo | Para qué |
|---|---|
| **Ctrl + O** | Abrir cualquier nota escribiendo su nombre |
| **Ctrl + P** | Paleta de comandos (por ejemplo, «Insertar plantilla») |
| **Ctrl + Shift + F** | Buscar texto en toda la bóveda |
| **Ctrl + G** | Ver el grafo |
| **Ctrl + clic** en un enlace | Abrirlo en otra pestaña |
| **Ctrl + E** | Cambiar entre edición y lectura |

### 5. Plantillas
Crea una nota nueva → **Ctrl + P** → escribe «Insertar plantilla» → elige una (Decisión, Entrevista, Aprendizaje, Sprint o Tabla). Se llena sola con la estructura y la fecha. Las plantillas están en la carpeta `Plantillas`.

### 6. Propiedades
Lo que va entre `---` arriba de la nota: `responsable: Wilson`, `estado: En curso`, `tags: [decision]`. Sirven para filtrar y buscar; por ejemplo, buscar `tag:#decision` muestra todas las decisiones.

### 7. Grafo (Ctrl + G)
Un mapa donde cada nota es un punto y cada enlace una línea. Muestra de un vistazo qué está conectado con qué y qué notas quedaron sueltas (sin enlaces).

---

## Beneficios para Offero

1. **Una sola memoria del equipo.** Hoy la información está repartida entre PDFs, WhatsApp, Discord y la cabeza de cada uno. Aquí cada decisión, entrevista y error resuelto tiene su nota, enlazada al módulo que afecta. Si en enero alguien pregunta «¿por qué solo reseña el que aceptó una cotización?», la respuesta está en [[D-08 Reglas contra reseñas falsas]] con su motivo.
2. **Protege contra el «factor bus».** Si Diego falta una semana, Iker abre [[M1 Autenticación y roles]] y [[profiles]] y entiende qué se hizo. Era uno de los riesgos más altos del plan.
3. **Mejores respuestas de la IA.** [[Contexto del proyecto]] está pensada para pegarla al inicio de cada conversación con la IA. Si está al día, las respuestas salen con el stack, las tablas y las reglas correctas en vez de inventar.
4. **Vive junto al código.** Está en `docs/` del repositorio: tiene historial (quién cambió qué y cuándo), se revisa en PR igual que el código, no depende de que nadie pague nada y son archivos de texto que también se leen en GitHub o VS Code.
5. **Ayuda en la presentación al profesor.** Al final habrá entrevistas, hipótesis validadas o no, decisiones justificadas, retrospectivas y aprendizajes. Eso demuestra *proceso*, no solo código, y Scrum se evalúa justamente por eso.
6. **Menos errores repetidos.** `06 Aprendizaje` guarda cosas como «la tabla devolvía vacío porque no tenía política SELECT». La próxima persona lo encuentra con **Ctrl + Shift + F** en segundos.

---

## Ejemplo de uso real
Después de entrevistar a una empresa de Bogotá:
1. Creas la nota `Entrevista 2026-11-12 Pedraza` con la plantilla «Entrevista».
2. Anotas lo que dijeron, con frases textuales entre comillas.
3. En «Qué aprendimos» escribes: «H2: responden cotizaciones en 24 h por WhatsApp → ver [[Visión y MVP]]».
4. Si sale una decisión, creas `D-10 Categorías iniciales` y la enlazas desde la entrevista y desde [[M2 Negocios y categorías]].
5. Al final del día: rama → commit → PR → fusionar (ver abajo).

Así, quien abra M2 ve la decisión, y quien abra la decisión ve de qué entrevista salió.

---

## Lo que NO es
- **No es el tablero de tareas.** Las tareas siguen en GitHub Projects («Offero»). Aquí solo se enlaza el issue (`#23`). Dos lugares para lo mismo = dos versiones de la verdad.
- **No se sincroniza solo.** Los cambios llegan a los demás por Git (`git pull` y PR), igual que el código. Si alguien no hace `git pull`, ve una versión vieja.
- **No es para datos sensibles.** Nada de claves, contraseñas ni datos personales de las empresas.

---

## Reglas del equipo
1. **Una idea, una nota.** Si algo merece explicarse, merece su propia nota.
2. **Enlaza todo** con `[[nombre de la nota]]`. Una nota sin enlaces se pierde.
3. **Usa las plantillas** (**Ctrl + P** → «Insertar plantilla»).
4. **Nombres claros**: `D-10 Correos de confirmación`, `Entrevista 2026-11-12 Pedraza`, `Sprint 3`.
5. **Las tareas no van aquí**: van en GitHub (issues y tablero). Aquí enlazas al issue (`#23`).
6. **Nada de claves, contraseñas ni datos personales** de las empresas entrevistadas (solo nombre del negocio y rol).
7. **Escribe en español**, corto y directo.

---

## Cómo guardar los cambios (Git)
La bóveda vive en el repositorio, así que se guarda como el código: **rama → commit → PR**.
1. Antes de escribir:
   ```powershell
   git switch main
   git pull
   git switch -c docs/tu-cambio
   ```
2. Escribe en Obsidian.
3. Guarda y sube:
   ```powershell
   git add docs
   git commit -m "docs: agrega entrevista con ..."
   git push -u origin docs/tu-cambio
   ```
4. Abre el PR en GitHub. Los PR que solo cambian `docs/` los puede aprobar cualquier compañero.

Consejo: junta varias notas en un solo PR al final del día; no hace falta un PR por nota.

**Qué no se sube:** la configuración personal de Obsidian (`.obsidian/workspace*.json`) está en `docs/.gitignore`. Cada uno puede tener sus pestañas abiertas sin pisar a los demás.

---

## Qué escribe cada uno
| Quién | Qué mantiene |
|---|---|
| Cada dueño de módulo | Su nota en `02 Módulos` y las notas de sus tablas en `07 Base de datos` |
| Diego (PO) | `03 Decisiones`, `05 Entrevistas`, [[Contexto del proyecto]] |
| Facilitador de la Retro | La sección Retro de la nota del sprint en `04 Sprints` |
| Wilson (documentación) | Revisa que todo esté al día al cerrar cada sprint |
| Todos | `06 Aprendizaje` cada vez que algo les costó horas |

Volver a [[00 Inicio]]
