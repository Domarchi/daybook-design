import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { generar } from "../scripts/build.mjs";

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
  const tamanos = ["caption", "meta", "body", "emphasis", "heading", "title", "display"].map((n) => parseInt(escala[`text-${n}`]));
  assert.deepEqual([...tamanos].sort((a, b) => a - b), tamanos);
  assert.equal(escala["text-body"], "14px");
});

test("cada valor es un color hexadecimal de 6 dígitos o un rgba()", () => {
  for (const tema of ["light", "dark"])
    for (const [nombre, valor] of Object.entries(tokens[tema]))
      assert.match(valor, /^(#[0-9a-f]{6}|rgba\(\d+, \d+, \d+, (0|1|0?\.\d+)\))$/, `${tema}.${nombre} = ${valor}`);
});

test("dist/tokens.css está generado desde src/tokens.json", () => {
  assert.equal(readFileSync(join(raiz, "dist/tokens.css"), "utf8"), generar());
});
