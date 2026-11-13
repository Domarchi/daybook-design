import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { generar, generarMarca } from "../scripts/build.mjs";

const raiz = join(import.meta.dirname, "..");
const tokens = JSON.parse(readFileSync(join(raiz, "src/tokens.json"), "utf8"));

function luminancia(hex) {
  const canales = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
}
export function contraste(a, b) {
  const [alto, bajo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (alto + 0.05) / (bajo + 0.05);
}

// [primer plano, fondo, mínimo WCAG, qué es]
const pares = [
  ["text", "bg", 4.5, "texto sobre el fondo"],
  ["text", "surface", 4.5, "texto en tarjetas"],
  ["text", "surface-subtle", 4.5, "texto en superficie suave"],
  ["text", "surface-muted", 4.5, "texto en superficie apagada"],
  ["text-soft", "bg", 4.5, "texto secundario fuerte"],
  ["text-soft", "surface", 4.5, "texto secundario fuerte en tarjetas"],
  ["text-muted", "bg", 4.5, "texto apagado"],
  ["text-muted", "surface", 4.5, "texto apagado en tarjetas"],
  ["text-muted", "surface-subtle", 4.5, "texto apagado en superficie suave"],
  ["action-text", "action", 4.5, "botón principal"],
  ["action-text", "action-hover", 4.5, "botón principal bajo el mouse"],
  ["brand", "surface", 4.5, "texto dorado de marca"],
  ["brand", "brand-soft", 4.5, "etiqueta dorada"],
  ["border-strong", "surface", 3, "borde de campo"],
  ["border-strong", "bg", 3, "borde de campo sobre el fondo"],
  ["focus", "bg", 3, "anillo de foco"],
  ["focus", "surface", 3, "anillo de foco en tarjetas"],
  ["success", "success-soft", 4.5, "pastilla de éxito"],
  ["warning", "warning-soft", 4.5, "pastilla de alerta"],
  ["danger", "danger-soft", 4.5, "pastilla de error"],
  ["info", "info-soft", 4.5, "pastilla informativa"],
  ["success", "surface", 4.5, "texto de éxito"],
  ["warning", "surface", 4.5, "texto de alerta"],
  ["danger", "surface", 4.5, "texto de error"],
  ["info", "surface", 4.5, "texto informativo"],
  ["rail-text", "rail-bg", 4.5, "texto del riel"],
  ["rail-text-muted", "rail-bg", 4.5, "texto apagado del riel"],
  ["rail-focus", "rail-bg", 3, "foco en el riel"],
  ["rail-indicator", "rail-bg", 3, "barra del ítem activo del riel"],
  ["toast-text", "toast-bg", 4.5, "texto del aviso"],
  ["toast-success", "toast-bg", 3, "ícono de éxito del aviso"],
  ["toast-danger", "toast-bg", 3, "ícono de error sobre el aviso normal"],
  ["toast-text", "toast-danger-bg", 4.5, "texto del aviso de error"],
  ["toast-danger", "toast-danger-bg", 3, "ícono del aviso de error"],
  ["toast-bg", "bg", 1.15, "el aviso se separa del fondo"],
  ["danger-action-text", "danger-action", 4.5, "botón de peligro"],
  ["danger-action-text", "danger-action-hover", 4.5, "botón de peligro bajo el mouse"],
  ["danger-action", "surface", 3, "botón de peligro sobre el diálogo"],
];

for (const tema of ["light", "dark"]) {
  test(`tema ${tema}: los pares de color cumplen WCAG AA`, () => {
    const fallas = [];
    for (const [frente, fondo, minimo, que] of pares) {
      const razon = contraste(tokens[tema][frente], tokens[tema][fondo]);
      if (razon < minimo) fallas.push(`${que} (${frente} sobre ${fondo}) da ${razon.toFixed(2)}:1, pide ${minimo}:1`);
    }
    assert.deepEqual(fallas, []);
  });
}

test("claro y oscuro definen exactamente los mismos nombres", () => {
  assert.deepEqual(Object.keys(tokens.light).sort(), Object.keys(tokens.dark).sort());
});

test("la escala usa unidades explícitas y las fuentes tienen respaldo", () => {
  const { escala } = tokens;
  for (const [nombre, valor] of Object.entries(escala)) {
    if (/^(text|radius|space)-/.test(nombre)) assert.match(valor, /^\d+px$/, `${nombre} = ${valor}`);
    if (nombre.startsWith("weight-")) assert.match(valor, /^[1-9]00$/, `${nombre} = ${valor}`);
    if (nombre.startsWith("leading-")) assert.match(valor, /^\d(\.\d+)?$/, `${nombre} = ${valor}`);
    if (nombre.startsWith("duration-")) assert.match(valor, /^\d+ms$/, `${nombre} = ${valor}`);
  }
  // Sin respaldo, una app que no cargó Geist quedaría con la fuente con serifa del navegador.
  assert.match(escala["font-sans"], /^var\(--font-geist-sans, [^)]+\), .*sans-serif$/);
  assert.match(escala["font-mono"], /^var\(--font-geist-mono, [^)]+\), .*monospace$/);
  // La escala de texto crece de menor a mayor, y el cuerpo es 14 px (decisión 2026-11-12).
  const tamanos = ["overline", "caption", "meta", "body", "emphasis", "heading", "title", "display"].map((n) => parseInt(escala[`text-${n}`]));
  assert.deepEqual([...tamanos].sort((a, b) => a - b), tamanos);
  assert.equal(escala["text-body"], "14px");
  // Los campos de formulario en el teléfono usan --db-text-emphasis: por debajo de
  // 16 px, Safari de iOS hace zoom al tocarlos.
  assert.ok(parseInt(escala["text-emphasis"]) >= 16, "text-emphasis no puede bajar de 16 px");
  const radios = ["small", "control", "card"].map((n) => parseInt(escala[`radius-${n}`]));
  assert.deepEqual([...radios].sort((a, b) => a - b), radios);
});

test("los componentes comunes usan la escala y respetan el objetivo táctil", () => {
  const { escala } = tokens;
  // 44 px es el objetivo táctil mínimo (WCAG 2.5.5, guías de iOS y Android).
  for (const nombre of ["button-height", "field-height"]) assert.ok(parseInt(escala[nombre]) >= 44, `${nombre} = ${escala[nombre]}`);
  // Las decisiones del 2026-11-12: botón 14 px semibold, pastilla 12 px píldora,
  // encabezado de tabla en mayúsculas.
  assert.equal(escala["button-font-size"], "var(--db-text-body)");
  assert.equal(escala["badge-font-size"], "var(--db-text-caption)");
  assert.equal(escala["badge-radius"], "var(--db-radius-pill)");
  assert.equal(escala["table-head-transform"], "uppercase");
  // Toda referencia var(--db-…) dentro de la escala apunta a algo que existe.
  for (const [nombre, valor] of Object.entries(escala))
    for (const [, ref] of valor.matchAll(/var\(--db-([\w-]+)\)/g))
      assert.ok(ref in escala || ref in tokens.light, `${nombre} apunta a --db-${ref}, que no existe`);
});

test("el layout común: riel de 232 px, cabecera de 64 px, contenido de 1360 px", () => {
  const { escala } = tokens;
  assert.equal(escala["rail-width"], "232px");
  // En tableta (hasta 1024 px) el riel es compacto: con 232 px, a 768 px el
  // contenido de Parte Diario bajaba de 480 px.
  assert.equal(escala["rail-width-compact"], "214px");
  assert.equal(escala["topbar-height"], "64px");
  assert.equal(escala["content-max"], "1360px");
  assert.ok(parseInt(escala["rail-item-height"]) >= 44, "los ítems del riel son objetivos táctiles");
});

test("flujos y estados: aviso abajo al centro, 4 s (10 s con «Deshacer»), esqueleto y vacío", () => {
  const { escala } = tokens;
  assert.equal(escala["toast-duration"], "4000ms");
  assert.equal(escala["toast-duration-undo"], "10000ms");
  assert.ok(parseInt(escala["toast-min-height"]) >= 44, "el aviso es un objetivo táctil (lleva «Deshacer» o ✕)");
  assert.equal(escala["toast-max-width"], "420px");
  assert.equal(escala["empty-icon"], "44px");
  assert.match(escala["skeleton-duration"], /^\d+ms$/);
  // El esqueleto se distingue de la tarjeta donde se dibuja, sin gritar.
  for (const tema of ["light", "dark"]) {
    const r = contraste(tokens[tema].skeleton, tokens[tema].surface);
    assert.ok(r >= 1.05 && r < 1.6, `${tema}: esqueleto contra la tarjeta ${r.toFixed(2)}`);
  }
});

test("cada valor es un color hexadecimal de 6 dígitos o un rgba()", () => {
  for (const tema of ["light", "dark"])
    for (const [nombre, valor] of Object.entries(tokens[tema]))
      assert.match(valor, /^(#[0-9a-f]{6}|rgba\(\d+, \d+, \d+, (0|1|0?\.\d+)\))$/, `${tema}.${nombre} = ${valor}`);
});

test("dist/tokens.css está generado desde src/tokens.json", () => {
  assert.equal(readFileSync(join(raiz, "dist/tokens.css"), "utf8"), generar());
});

test("estados.css (esqueleto y vacío) solo usa variables que existen", () => {
  const css = readFileSync(join(raiz, "src/estados.css"), "utf8");
  const nombres = new Set([...Object.keys(tokens.escala), ...Object.keys(tokens.light)]);
  const usadas = [...css.matchAll(/var\(--db-([a-z0-9-]+)/g)].map((m) => m[1]);
  assert.ok(usadas.length > 10);
  // --db-skeleton-columns lo pone cada tabla (con 4 por defecto).
  const faltan = usadas.filter((n) => !nombres.has(n) && n !== "skeleton-columns");
  assert.deepEqual(faltan, []);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.db-skeleton \{\s*animation: none;/);
  for (const tema of ["light", "dark"]) {
    const icono = contraste(tokens[tema]["text-muted"], tokens[tema]["surface-muted"]);
    assert.ok(icono >= 3, `${tema}: ícono del vacío ${icono.toFixed(2)}:1`);
  }
  const paquete = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
  assert.equal(paquete.exports["./estados.css"], "./src/estados.css");
});

test("el sello de la familia: mismo símbolo, mismas medidas y texto legible en las tres apps", () => {
  const { escala } = tokens;
  assert.equal(escala["brand-mark"], "48px");
  assert.equal(escala["brand-mark-large"], "56px");
  assert.equal(escala["brand-name-size"], escala["text-emphasis"], "DAYBOOK a 16 px");
  assert.equal(escala["brand-product-size"], escala["text-overline"], "el producto a 11 px, el mínimo de la escala");
  // El producto va en dorado: tiene que leerse sobre el fondo de la entrada y sobre el riel.
  for (const tema of ["light", "dark"]) {
    const t = tokens[tema];
    for (const [fondo, color, que] of [
      ["bg", "brand", "producto sobre el fondo"],
      ["surface", "brand", "producto sobre una tarjeta"],
      ["rail-bg", "rail-indicator", "producto sobre el riel"],
      ["rail-bg", "rail-text", "DAYBOOK sobre el riel"],
      ["rail-bg", "rail-text-muted", "descriptor sobre el riel"],
    ]) {
      const r = contraste(t[color], t[fondo]);
      assert.ok(r >= 4.5, `${tema}: ${que} ${r.toFixed(2)}:1`);
    }
  }
});

test("dist/marca.css está generado y trae el símbolo canónico de src/marca/", () => {
  const css = generarMarca();
  assert.equal(readFileSync(join(raiz, "dist/marca.css"), "utf8"), css);
  assert.doesNotMatch(css, /__MARCA_/);
  for (const archivo of ["daybook-mark-on-light.svg", "daybook-mark-on-dark.svg"]) {
    const b64 = readFileSync(join(raiz, "src/marca", archivo)).toString("base64");
    assert.equal(css.split(b64).length - 1, 1, `${archivo} va una sola vez`);
  }
  const plantilla = readFileSync(join(raiz, "src/marca.css"), "utf8");
  const nombres = new Set([...Object.keys(tokens.escala), ...Object.keys(tokens.light), "brand-mark-on-light", "brand-mark-on-dark"]);
  const faltan = [...plantilla.matchAll(/var\(--db-([a-z0-9-]+)/g)].map((m) => m[1]).filter((n) => !nombres.has(n));
  assert.deepEqual(faltan, []);
  // El oscuro sigue las mismas reglas que tokens.css: elegido a mano o heredado del sistema.
  assert.match(plantilla, /:root\[data-theme="dark"\] \.db-mark/);
  assert.match(plantilla, /:root:not\(\[data-theme="light"\]\):not\(\[data-color-scheme="light"\]\) \.db-mark/);
  const paquete = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
  assert.equal(paquete.exports["./marca.css"], "./dist/marca.css");
});
