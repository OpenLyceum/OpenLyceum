// Small helpers shared by the handout SVG generators. Light background, print-friendly,
// colors chosen to stay distinct in grayscale and for common color-vision deficiencies.

export const C = {
  ink: "#1f2328",
  muted: "#57606a",
  grid: "#8c959f",
  blue: "#1f5fa8",
  red: "#b8322a",
  blueBg: "#e8f0fb",
  redBg: "#fbeceb",
  earth: "#1b7f4f",
  star: "#f6c445",
  starEdge: "#9a6a00",
  planet: "#2f6db5",
  velocity: "#6a3fa0",
  cm: "#c2185b",
  wave: "#a07b1e",
  curve: "#a35c00",
  orbitFill: "#eef3fa",
  s1: "#1f77b4",
  s2: "#d9711c",
  s3: "#2a9d55",
  s4: "#8e44ad",
};

const attrs = (a = {}) => Object.entries(a).map(([k, v]) => ` ${k}="${v}"`).join("");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const svg = (w, h, title, desc, body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="${C.ink}">
<title>${esc(title)}</title>
<desc>${esc(desc)}</desc>
<defs>${defs}</defs>
<rect width="${w}" height="${h}" fill="#ffffff"/>
${body}
</svg>
`;

export const text = (x, y, s, a = {}) => `<text x="${x}" y="${y}"${attrs(a)}>${esc(s)}</text>\n`;
export const line = (x1, y1, x2, y2, a = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${attrs(a)}/>\n`;
export const circle = (cx, cy, r, a = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}"${attrs(a)}/>\n`;
export const rect = (x, y, w, h, a = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${attrs(a)}/>\n`;
export const path = (d, a = {}) => `<path d="${d}"${attrs(a)}/>\n`;

/** An arrow from (x1,y1) to (x2,y2) with a filled head (and a second head if `both`). */
export function arrow(x1, y1, x2, y2, color, width = 2, both = false) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1 || width === 0) return "";
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  const hl = 6 + 2.5 * width, hw = 3 + 1.6 * width;
  const head = (tx, ty, dx, dy) =>
    path(`M${tx} ${ty} L${(tx - dx * hl + dy * hw).toFixed(1)} ${(ty - dy * hl - dx * hw).toFixed(1)} L${(tx - dx * hl - dy * hw).toFixed(1)} ${(ty - dy * hl + dx * hw).toFixed(1)} Z`, { fill: color });
  const sx = both ? x1 + ux * hl * 0.8 : x1, sy = both ? y1 + uy * hl * 0.8 : y1;
  let s = line(sx.toFixed(1), sy.toFixed(1), (x2 - ux * hl * 0.8).toFixed(1), (y2 - uy * hl * 0.8).toFixed(1), { stroke: color, "stroke-width": width });
  s += head(x2, y2, ux, uy);
  if (both) s += head(x1, y1, -ux, -uy);
  return s;
}

/** Deterministic random numbers so regenerated figures do not change. */
export function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
