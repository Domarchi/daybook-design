// Genera dist/tokens.css a partir de src/tokens.json.
//
// El CSS sale con tres bloques:
//   0. :root                → la escala (fuentes, tamaños, radios, espacios), igual en los dos temas.
//   1. :root                → tema claro (lo que se ve si nada dice lo contrario).
//   2. tema oscuro elegido  → :root[data-theme="dark"] y :root[data-color-scheme="dark"].
//      Ticket usa data-color-scheme y las otras dos data-theme; se aceptan los dos
//      mientras Ticket no se cambie de atributo.
//   3. sistema en oscuro    → el mismo oscuro dentro de prefers-color-scheme, salvo que
//      la persona haya elegido claro a mano. Así «seguir al sistema» funciona aunque la
//      app todavía no haya puesto el atributo.
//
// Uso: node scripts/build.mjs           (escribe dist/tokens.css)
//      node scripts/build.mjs --check   (falla si dist/tokens.css no está al día)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(raiz, "src/tokens.json"), "utf8"));
const { version } = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));

const declaraciones = (paleta, sangria) =>
  Object.entries(paleta)
    .map(([nombre, valor]) => `${sangria}--db-${nombre}: ${valor};`)
    .join("\n");

export function generar() {
  return `/* @daybook/design ${version} — generado desde src/tokens.json. No editar a mano. */

/* Fuentes, tamaños, pesos, interlineados, radios, espacios y movimiento: iguales
   en los dos temas. --db-font-sans y --db-font-mono usan las variables que pone
   next/font (Geist y Geist Mono); la app debe ponerlas en <html>, no en <body>,
   para que :root las vea. Si faltan, caen en la fuente del sistema. */
:root {
${declaraciones(tokens.escala, "  ")}
}

:root {
${declaraciones(tokens.light, "  ")}
}

:root[data-theme="dark"],
:root[data-color-scheme="dark"] {
${declaraciones(tokens.dark, "  ")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-color-scheme="light"]) {
${declaraciones(tokens.dark, "    ")}
  }
}
`;
}

const destino = join(raiz, "dist/tokens.css");
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const css = generar();
  if (process.argv.includes("--check")) {
    let actual = "";
    try {
      actual = readFileSync(destino, "utf8");
    } catch {}
    if (actual !== css) {
      console.error("dist/tokens.css no está al día: corre `npm run build`.");
      process.exit(1);
    }
    console.log("dist/tokens.css al día.");
  } else {
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, css);
    console.log(`dist/tokens.css escrito (${version}).`);
  }
}
