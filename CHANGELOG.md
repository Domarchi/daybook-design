# Cambios

## 0.2.0 — 2026-11-12

- Escala compartida, igual en los dos temas, con los valores de Parte Diario:
  fuentes Geist y Geist Mono (`--db-font-sans`, `--db-font-mono`, con respaldo a la
  del sistema), tamaños de texto con cuerpo de 14 px (`--db-text-caption` 12 →
  `--db-text-display` 28), pesos, interlineados, radios (8 controles, 12 tarjetas y
  diálogos), espacios de 4 a 64 px y duraciones/curva de movimiento.
- Sin cambios en los colores.

## 0.1.0 — 2026-11-12

- Primera versión: colores claro y oscuro de la familia Daybook como variables `--db-*`.
- Oscuro negro tipo Vercel (fondo y riel `#000`, tarjetas `#0a0a0a`, bordes `#303030`).
- Acepta `data-theme` y `data-color-scheme`, y sigue al sistema cuando no hay elección.
- Pruebas de contraste WCAG AA para cada par texto/fondo en los dos temas.
