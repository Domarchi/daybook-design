# Cambios

## 0.10.0 — 2026-11-19

- Logo más chico: símbolo de 48 a 40 px y «DAYBOOK» de 16 a 14 px; el bloque
  de marca del riel baja de 108 a 92 px (12 px arriba y abajo). El producto
  queda en 11 px, el mínimo de la escala.
- `riel.css`, el pie común: `.db-rail-footer`, `.db-rail-account` (avatar,
  nombre y rol en una fila con línea arriba) y `.db-rail-icon-button` (44 px,
  para el tema y la ✕ del cajón). Salir y la cuenta van en Configuración.
- `riel.css`, movimiento:
  - La barra dorada de la fila marcada se funde junto con el fondo.
  - El resaltado de hover solo con mouse; en tabletas quedaba pegado.
  - `.db-rail-scroll`: sombra arriba o abajo cuando la lista no cabe.
  - `.db-rail-drawer` y `.db-rail-scrim`: el cajón del teléfono entra en
    240 ms y sale en 200 ms con la misma curva en las tres apps, se ve
    mientras sale y el velo se funde en vez de aparecer de golpe.
  - `.db-view-enter`: la vista nueva entra con un fundido de 180 ms.
  - El número `--alert` entra con un pulso corto cuando cambia.
  - `.db-theme-switching` en `<html>` congela las transiciones mientras
    cambia el tema, para que el riel no parpadee.
  - Con movimiento reducido no hay desplazamientos ni escalas; quedan
    fundidos cortos.
- Tokens nuevos: `--db-rail-avatar`, `--db-drawer-duration`,
  `--db-duration-exit`, `--db-ease-drawer`, `--db-rail-drawer-shadow` y
  `--db-rail-scrim` (por tema).

## 0.9.0 — 2026-11-18

- `src/riel.css` (export `@daybook/design/riel.css`): la lista del riel. Parte
  Diario y Ticket dibujaban la navegación lateral cada una a su manera (otro
  margen, otro aire entre filas, otra letra en los títulos de grupo, otra
  pastilla para los números). Ahora es una:
  - `.db-rail-nav`: la lista, metida 10 px; entre filas, 2 px.
  - `.db-rail-section`: título de grupo, 11 px, semibold, .12em, en mayúsculas.
  - `.db-rail-link`: fila de 44 px, 13 px medium; la marcada (`aria-current` o
    `.is-active`) en semibold, con fondo y la barra dorada de 3 px.
  - `.db-rail-count`: número en pastilla gris; `--alert` en dorado.
  - `.db-rail-divider`: línea entre grupos.
  - El ícono y el título de grupo empiezan a 22 px, el borde del símbolo.
- Tokens nuevos: `--db-rail-link` (color de la fila, más claro que el título de
  grupo), `--db-rail-inset`, `-item-gap`, `-item-padding-x`, `-icon`,
  `-section-tracking`, `-count-height`.
- Pruebas: variables existentes, alineación con la marca y contraste 4.5:1 de
  fila, título y número en los dos temas.

## 0.8.0 — 2026-11-13

- `dist/marca.css` (export `@daybook/design/marca.css`): el sello de la familia.
  Las tres apps dibujan el logo con las mismas clases y medidas, para que se
  lean como una batería de herramientas:
  - `.db-lockup`: símbolo de 48 px + «DAYBOOK» (16 px, semibold, .24em) + el
    producto en dorado (11 px, bold, .16em). El texto es HTML con Geist, no
    parte de un SVG: antes, dentro del logo de 168 px, el nombre del producto
    quedaba en unos 5 px y no se leía.
  - `.db-lockup-descriptor` (cliente u obra, 11 px en mayúsculas) fuera del logo.
  - `.db-mark` (48 px) y `.db-mark--large` (56 px, tarjeta de entrada).
  - `.db-brand-block`: el bloque de marca del riel (108 px de alto, línea inferior).
  - `.db-on-dark` para el riel, oscuro en los dos temas.
- El símbolo canónico vive en `src/marca/` y viaja dentro del CSS como data URI;
  el tema oscuro cambia el dibujo con las mismas reglas que `tokens.css`.
- Tokens nuevos: `--db-brand-mark`, `-mark-large`, `-gap`, `-type-gap`,
  `-name-size`, `-name-tracking`, `-product-size`, `-product-tracking`,
  `-block-height`, `-block-padding-x`.
- Pruebas: el CSS generado está al día y trae el símbolo canónico una vez; el
  dorado del producto y el descriptor llegan a 4.5:1 sobre el fondo, las
  tarjetas y el riel.

## 0.7.0 — 2026-11-13

- `src/estados.css` (export `@daybook/design/estados.css`): el esqueleto de carga
  y el vacío común de la Fase 5c, escritos una vez para las tres apps. Usa solo
  variables del paquete; el brillo del esqueleto se apaga con
  `prefers-reduced-motion`. Las clases llevan prefijo `db-`.
- Pruebas: toda variable que usa `estados.css` existe en `tokens.json`, y el
  ícono del vacío (`--db-text-muted` sobre `--db-surface-muted`) llega a 3:1.

## 0.6.0 — 2026-11-13

- Flujos y estados (Fase 5), decididos el 2026-11-13:
  - Aviso: tarjeta oscura en los dos temas (`--db-toast-*`), abajo al centro del
    contenido, 48 px de alto mínimo, 4 s (10 s con «Deshacer»); variante de error
    con su propio par de rojos, elegidos contra el fondo del aviso.
  - Botón de peligro de los diálogos (`--db-danger-action*`), texto blanco 4.5:1.
  - Esqueleto de carga (`--db-skeleton`, `--db-skeleton-shine`, 1400 ms) y
    medidas del vacío común (ícono de 44 px, texto de 420 px como máximo).
- Pruebas: contraste del aviso y del botón de peligro; el esqueleto se distingue
  de la tarjeta sin pasar de 1.6:1.

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
