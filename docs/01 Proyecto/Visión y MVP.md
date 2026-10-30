---
tags: [proyecto, producto]
---
# Visión y MVP

## Product Goal
Que empresas y compradores de Bogotá publiquen lo que necesitan, reciban cotizaciones de proveedores reales y elijan una dentro de Offero, y que para el 29 de enero ambos lados lo hayan usado con transacciones reales.

## Camino feliz
1. El cliente se registra → [[M1 Autenticación y roles]]
2. Publica una solicitud → [[M3 Solicitudes]]
3. El proveedor la ve y cotiza → [[M2 Negocios y categorías]] + [[M4 Cotizaciones]]
4. El cliente compara y elige → [[M4 Cotizaciones]]
5. Se comunican → [[M5 Mensajería]]
6. El cliente deja una reseña → [[M6 Reseñas]]

## Hipótesis a validar
| # | Hipótesis | Cómo sabremos | Estado |
|---|---|---|---|
| H1 | Los compradores prefieren publicar y recibir propuestas a buscar proveedores uno por uno | 2+ compradores publican 3+ solicitudes reales | Abierta |
| H2 | Los proveedores responden a solicitudes de desconocidos | 60 % de solicitudes con 1+ cotización en 72 h | Abierta |
| H3 | Comparar en un mismo lugar facilita decidir | 2+ solicitudes con cotización elegida en la app | Abierta |
| H4 | Las reseñas generan confianza | 1+ reseña real y comentarios positivos en entrevistas | Abierta |
| H5 | Modelo de negocio | Se explora en [[Entrevistas MOC]] | Abierta |

## Prioridades (MoSCoW)
- **Must:** M0–M4 completos + seguridad (RLS, rutas protegidas, validación en el servidor)
- **Should:** M5, M6 y M7 en versión mínima
- **Could:** versiones completas y extras de enero
- **Won't:** pagos, app móvil, microservicios, IA avanzada, varios países
