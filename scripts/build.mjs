// Genera dist/tokens.css a partir de src/tokens.json y dist/marca.css a partir de
// src/marca.css (con el símbolo de src/marca/ dentro).
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

// dist/marca.css: src/marca.css con los dos dibujos del símbolo dentro, como
// data URI. Así el símbolo llega con el CSS y ninguna app copia archivos a public/.
const dataUri = (archivo) =>
  `data:image/svg+xml;base64,${readFileSync(join(raiz, "src/marca", archivo)).toString("base64")}`;

export function generarMarca() {
  const plantilla = readFileSync(join(raiz, "src/marca.css"), "utf8");
  return `/* @daybook/design ${version} — generado desde src/marca.css y src/marca/*.svg. No editar a mano. */\n${plantilla
    .replaceAll("__MARCA_CLARA__", dataUri("daybook-mark-on-light.svg"))
    .replaceAll("__MARCA_OSCURA__", dataUri("daybook-mark-on-dark.svg"))}`;
}

const salidas = [
  ["dist/tokens.css", generar],
  ["dist/marca.css", generarMarca],
];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let desfasado = false;
  for (const [ruta, generador] of salidas) {
    const destino = join(raiz, ruta);
    const css = generador();
    if (process.argv.includes("--check")) {
      let actual = "";
      try {
        actual = readFileSync(destino, "utf8");
      } catch {}
      if (actual !== css) {
        console.error(`${ruta} no está al día: corre \`npm run build\`.`);
        desfasado = true;
      } else console.log(`${ruta} al día.`);
    } else {
      mkdirSync(dirname(destino), { recursive: true });
      writeFileSync(destino, css);
      console.log(`${ruta} escrito (${version}).`);
    }
  }
  if (desfasado) process.exit(1);
}
