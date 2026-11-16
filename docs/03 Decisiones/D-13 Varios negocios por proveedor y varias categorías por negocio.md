---
tags: [decision]
id: D-13
estado: Tomada
fecha: 2026-11-10
---
# D-13 · Varios negocios por proveedor y varias categorías por negocio

- **Estado:** Tomada (10 nov 2026)
- **Decide:** el equipo en la [[Sesión de diseño (T0-07)|sesión de diseño de la base de datos]], con Diego (PO)
- **Contexto:** La guía suponía un solo negocio por proveedor (`owner_id` único) y una sola categoría por negocio (`category_id`).
- **Decisión:**
  1. Un proveedor puede tener **varios** negocios: `owner_id` no es único.
  2. Un negocio puede tener **varias** categorías: tabla intermedia `business_categories` (`business_id`, `category_id`).
  3. Las tablas se conectan con el **id** (clave foránea), nunca con el nombre o un texto. No se puede borrar una categoría en uso (`on delete restrict`).
  4. Cada categoría tiene un **código** con formato `Tec01` (una mayúscula, dos minúsculas y dos números).
- **Alternativas:** un solo negocio y una sola categoría, como decía la guía. Más simple, pero no refleja proveedores con varios negocios o servicios.
- **Motivo:** Un mismo proveedor puede tener negocios distintos, y un negocio puede ofrecer servicios de varios nichos.
- **Consecuencias:**
  - **M2 (Daniel):** `businesses` sin `owner_id` único y la tabla `business_categories` (T1-08). El servicio «negocio del usuario actual» pasa a «negocios del usuario actual» (T1-10).
  - **M4 (Diego):** al cotizar, el proveedor elige con cuál de sus negocios lo hace.
  - **M3 (Wilson):** `requests` sigue con una sola categoría (`category_id`).

Volver a [[Registro de decisiones]]