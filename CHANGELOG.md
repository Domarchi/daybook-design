# Cambios

## 0.5.1 — 2026-11-12

- `--db-rail-width-compact` (214 px): el riel en tableta, hasta 1024 px de ancho.
  Con 232 px, en una tableta vertical (768 px) el contenido de Parte Diario
  quedaba bajo 480 px; 214 px era el riel compacto que ya usaba.

## 0.5.0 — 2026-11-12

- Layout común, decidido el 2026-11-12: riel de 232 px (`--db-rail-width`) con
  ítems de 44 px, barra de 3 px en el ítem activo (`--db-rail-indicator`, dorado
  sobre el riel en los dos temas), cabecera fija de 64 px (`--db-topbar-height`) y
  contenido con tope de 1360 px y margen de 32 px.
- Prueba: contraste 3:1 de la barra del activo sobre el riel.

## 0.4.0 — 2026-11-12

- Medidas de los componentes comunes, decididas el 2026-11-12:
  - Botón: 44 px de alto, 16 px de relleno lateral, 14 px semibold, radio 8.
  - Campo: 44 px de alto, 12 px de relleno lateral, 14 px, radio 8; el borde es
    `--db-border-strong` (3:1).
  - Pastilla de estado: 24 px de alto, 8 px de relleno, 12 px semibold, píldora,
    punto de 6 px.
  - Encabezado de tabla: 12 px semibold, mayúsculas, espaciado .08em, sin fondo.
- Prueba: botón y campo no bajan de 44 px y toda referencia interna existe.

## 0.3.0 — 2026-11-12

- `--db-text-overline` (11 px) para etiquetas en mayúsculas con espaciado, el
  tamaño que ya usaban el riel de Parte Diario y las etiquetas de Ticket.
- `--db-radius-small` (4 px) para piezas chicas (teclas, casillas).
- Prueba: `--db-text-emphasis` nunca baja de 16 px (los campos en el teléfono lo
  usan para que iOS no haga zoom) y los radios crecen en orden.

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
