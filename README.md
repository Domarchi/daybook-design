# @daybook/design

Fuente única del diseño de la familia Daybook: **Parte Diario**, **Daybook Travel** y **Daybook Ticket**.
Un cambio aquí llega a las tres apps subiendo la versión en cada una; nadie vuelve a copiar colores a mano.

## Qué trae (v0.3)

- `src/tokens.json` — los colores (tema claro y oscuro) y la escala (fuentes, tamaños, radios, espacios), con un solo nombre por concepto.
- `dist/tokens.css` — todo eso como variables `--db-*`, generado. **No se edita a mano.**

| Grupo | Variables |
|---|---|
| Fondos | `--db-bg`, `--db-surface`, `--db-surface-raised`, `--db-surface-subtle`, `--db-surface-muted`, `--db-surface-hover` |
| Texto | `--db-text`, `--db-text-soft`, `--db-text-muted` |
| Bordes | `--db-border` (estructura), `--db-border-subtle`, `--db-border-strong` (campos, 3:1) |
| Acción | `--db-action`, `--db-action-hover`, `--db-action-text` (botón principal) |
| Marca | `--db-focus`, `--db-brand`, `--db-brand-soft` (el dorado: foco, logo, etiquetas) |
| Estados | `--db-success`, `--db-warning`, `--db-danger`, `--db-info` y su `-soft` |
| Riel | `--db-rail-bg`, `--db-rail-text`, `--db-rail-text-muted`, `--db-rail-border`, `--db-rail-hover`, `--db-rail-active`, `--db-rail-focus` |

Escala (igual en los dos temas):

| Grupo | Variables |
|---|---|
| Fuentes | `--db-font-sans` (Geist), `--db-font-mono` (Geist Mono) |
| Texto | `--db-text-overline` 11 (mayúsculas), `-caption` 12, `-meta` 13, `-body` 14, `-emphasis` 16, `-heading` 18, `-title` 22, `-display` 28 |
| Peso / interlineado | `--db-weight-regular/medium/semibold/bold`, `--db-leading-tight/ui/body` |
| Radios | `--db-radius-small` 4, `-control` 8, `-card` 12, `-overlay` 12, `-pill` |
| Espacios | `--db-space-1` 4 … `--db-space-8` 64 |
| Movimiento | `--db-duration-fast`, `--db-duration-enter`, `--db-ease-out` |

### Decisiones que fija

- **Oscuro negro tipo Vercel**: fondo, riel y cabecera `#000`, tarjetas `#0a0a0a`, bordes `#303030`.
- **Riel grafito `#11120f` en el tema claro**, negro en el oscuro.
- **Botón principal blanco en oscuro**; el dorado queda para foco, marca y etiquetas.
- **Seguir al sistema**: sin elección explícita, el CSS toma el tema del sistema operativo.
- **Geist** como fuente de las tres apps y **14 px** como tamaño del texto de trabajo.

### Cómo elige el tema

| Atributo en `<html>` | Resultado |
|---|---|
| `data-theme="dark"` o `data-color-scheme="dark"` | oscuro |
| `data-theme="light"` o `data-color-scheme="light"` | claro |
| ninguno (o `system`) | lo que diga el sistema |

Se aceptan los dos atributos porque Ticket todavía usa `data-color-scheme`.

## Instalar en una app

```bash
npm install github:Domarchi/daybook-design#v0.1.0
```

Y en `app/layout.tsx`, **antes** de los CSS propios:

```ts
import "@daybook/design/tokens.css";
```

Para Geist, cargar las fuentes con `next/font` y poner sus variables en `<html>` (no en
`<body>`: `:root` tiene que verlas):

```tsx
import { Geist, Geist_Mono } from "next/font/google";
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// <html className={`${sans.variable} ${mono.variable}`}> … y body { font-family: var(--db-font-sans) }
```

Luego cada app apunta sus variables propias a las del paquete, por ejemplo
`--canvas: var(--db-bg);`. Las apps conservan sus nombres internos; lo que cambia es de
dónde sale el valor.

## Cambiar un color

1. Editar `src/tokens.json`.
2. `npm run build` y `npm test` (contraste WCAG AA de cada par texto/fondo en los dos temas).
3. Subir la versión en `package.json`, anotar en `CHANGELOG.md`, commit y etiqueta `vX.Y.Z`.
4. En cada app: `npm install github:Domarchi/daybook-design#vX.Y.Z` y revisar en el navegador.
