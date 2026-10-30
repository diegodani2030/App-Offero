---
tags: [inicio]
---
# Cómo usar esta bóveda

## Abrirla por primera vez
1. Instala Obsidian (obsidian.md) en Windows.
2. Ten el repositorio clonado en `C:\dev\App-Offero` (Anexo B de tu guía).
3. En Obsidian: **Abrir carpeta como bóveda** → elige `C:\dev\App-Offero\docs`.
4. Si pregunta por los plugins, acepta «Confiar en el autor». No hace falta instalar plugins de la comunidad.

## Reglas del equipo
1. **Una idea, una nota.** Si algo merece explicarse, merece su propia nota.
2. **Enlaza todo** con `[[nombre de la nota]]`. Una nota sin enlaces se pierde.
3. **Usa las plantillas** (`Ctrl + P` → «Insertar plantilla»). Están en la carpeta `Plantillas`.
4. **Nombres claros**: `D-10 Correos de confirmación`, `Entrevista 2026-11-12 Pedraza`, `Sprint 3`.
5. **Las tareas no van aquí**: van en GitHub (issues y tablero). Aquí enlazas al issue (`#23`).
6. **Nada de claves, contraseñas ni datos personales** de las empresas entrevistadas (solo nombre del negocio y rol).
7. **Escribe en español**, corto y directo.

## Cómo guardar los cambios (Git)
La bóveda vive en el repositorio, así que se guarda como el código: **rama → commit → PR**.
1. Antes de escribir: `git switch main` → `git pull` → `git switch -c docs/tu-cambio`
2. Escribe en Obsidian.
3. `git add docs` → `git commit -m "docs: agrega entrevista con ..."` → `git push -u origin docs/tu-cambio`
4. Abre el PR. Los PR que solo cambian `docs/` los puede aprobar cualquier compañero.

Consejo: junta varias notas en un solo PR al final del día; no hace falta un PR por nota.

## Qué no se sube
La configuración personal de Obsidian (`.obsidian/workspace*.json`) está en `.gitignore`: cada uno puede tener sus pestañas abiertas sin pisar a los demás.

## Qué escribe cada uno
| Quién | Qué mantiene |
|---|---|
| Cada dueño de módulo | Su nota en `02 Módulos` y las notas de sus tablas en `07 Base de datos` |
| Diego (PO) | `03 Decisiones`, `05 Entrevistas`, [[Contexto del proyecto]] |
| Facilitador de la Retro | La sección Retro de la nota del sprint en `04 Sprints` |
| Wilson (documentación) | Revisa que todo esté al día al cerrar cada sprint |
| Todos | `06 Aprendizaje` cada vez que algo les costó horas |
