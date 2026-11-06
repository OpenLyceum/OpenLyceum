// Writes the Transit Hunter handout diagrams to ../TransitHunter/svg/.
//   node handouts/tools/svg-transithunter.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { C, svg, text, arrow, line, circle, path, rect, mulberry } from "./svglib.mjs";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../TransitHunter/svg");
mkdirSync(out, { recursive: true });
const save = (name, s) => { writeFileSync(`${out}/${name}`, s); console.log("wrote", name); };
const starDisk = (cx, cy, r) => circle(cx, cy, r, { fill: "url(#star)", stroke: C.starEdge, "stroke-width": 1.2 });
const starDefs = `<radialGradient id="star" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="#fff6d8"/><stop offset="0.7" stop-color="#f8d77a"/><stop offset="1" stop-color="#e2a92f"/></radialGradient>`;

/** Fraction of a uniform star disk (radius 1) covered by a planet of radius k at center distance z. */
function blocked(z, k) {
  if (z >= 1 + k) return 0;
  if (z <= 1 - k) return k * k;
  const k0 = Math.acos((k * k + z * z - 1) / (2 * k * z)), k1 = Math.acos((1 - k * k + z * z) / (2 * z));
  return (k * k * k0 + k1 - Math.sqrt((4 * z * z - (1 + z * z - k * k) ** 2) / 4)) / Math.PI;
}

// 1. Transit seen from Earth and its light curve ───────────────────────────────
{
  const W = 660, H = 400, cx = 330, cy = 110, R = 80, k = 0.22, rp = R * k;
  let body = text(cx, 22, "Seen from Earth: the planet crosses the face of its star", { "text-anchor": "middle", "font-weight": "bold" });
  body += starDisk(cx, cy, R);
  const xs = [-1.55, -1.0, 0, 1.0, 1.55];
  xs.forEach((x, i) => {
    body += circle(cx + x * R, cy + 0.2 * R, rp, { fill: "#2b2b2b", "fill-opacity": i === 2 ? 1 : 0.75 });
    body += text(cx + x * R, cy + 0.2 * R - rp - 6, String(i + 1), { "text-anchor": "middle", "font-size": 13, "font-weight": "bold", fill: C.planet });
  });
  body += line(cx - 1.9 * R, cy + 0.2 * R, cx + 1.9 * R, cy + 0.2 * R, { stroke: C.planet, "stroke-dasharray": "4 4" });
  // light curve
  const x0 = 110, x1 = 550, yTop = 260, scaleY = 1400, tz = (x) => (x - (x0 + x1) / 2) / ((x1 - x0) / 2) * 1.9;
  body += text(cx, 238, "The light curve: how bright the star looks", { "text-anchor": "middle", "font-weight": "bold" });
  body += line(x0, 340, x1, 340, { stroke: C.grid });
  body += line(x0, 250, x0, 340, { stroke: C.grid });
  let d = "";
  for (let x = x0; x <= x1; x += 1) d += `${x === x0 ? "M" : "L"}${x} ${(yTop + scaleY * blocked(Math.abs(tz(x)), k) * 1).toFixed(1)} `;
  body += path(d, { fill: "none", stroke: C.curve, "stroke-width": 2.5 });
  xs.forEach((x, i) => {
    const px = (x0 + x1) / 2 + (x / 1.9) * ((x1 - x0) / 2);
    const py = yTop + scaleY * blocked(Math.abs(x), k);
    body += circle(px, py, 4, { fill: C.planet });
    body += text(px, py - 8, String(i + 1), { "text-anchor": "middle", "font-size": 13, "font-weight": "bold", fill: C.planet });
  });
  const depthY = yTop + scaleY * k * k;
  body += arrow(x0 + 18, yTop, x0 + 18, depthY, C.red, 1.5, true);
  body += text(x0 + 24, (yTop + depthY) / 2 + 5, "depth", { fill: C.red, "font-size": 13 });
  const xin = (x0 + x1) / 2 - (1 + k) / 1.9 * ((x1 - x0) / 2), xout = (x0 + x1) / 2 + (1 + k) / 1.9 * ((x1 - x0) / 2);
  body += arrow(xin, 358, xout, 358, C.ink, 1.3, true);
  body += text((xin + xout) / 2, 377, "duration (from first to last contact)", { "text-anchor": "middle", "font-size": 13 });
  body += text(x0 - 8, yTop + 4, "100 %", { "text-anchor": "end", "font-size": 12, fill: C.muted });
  body += text(x1, 392, "time →", { "text-anchor": "end", "font-size": 13 });
  save("transit-light-curve.svg", svg(W, H, "A transit and its light curve",
    "Top: a planet at five positions as it crosses its star, seen from Earth. Bottom: the star's brightness at those five moments, with a flat-bottomed dip whose depth and duration are marked.", body, starDefs));
}

// 2. Depth is an area ratio, drawn to scale ─────────────────────────────────────
{
  const W = 660, H = 290, R = 110, cx = 160, cy = 150;
  let body = text(cx, 24, "The Sun, Jupiter and Earth to scale", { "text-anchor": "middle", "font-weight": "bold" });
  body += starDisk(cx, cy, R);
  const rj = R * 0.1028, re = R * 0.00916;
  body += circle(cx - 30, cy + 20, rj, { fill: "#8a5a2b" });
  body += text(cx - 30, cy + 20 + rj + 16, "Jupiter", { "text-anchor": "middle", "font-size": 12 });
  body += circle(cx + 50, cy - 30, Math.max(re, 1.2), { fill: C.planet });
  body += line(cx + 52, cy - 32, cx + 80, cy - 60, { stroke: C.planet });
  body += text(cx + 82, cy - 62, "Earth (the dot)", { "font-size": 12, fill: C.planet });
  const tx = 320;
  body += text(tx, 70, "Light blocked = planet's disk ÷ star's disk", { "font-weight": "bold" });
  body += text(tx, 100, "depth = πRₚ² ÷ πR★² = (Rₚ ÷ R★)²", { "font-size": 14 });
  body += text(tx, 140, "Jupiter-sized:  (1 ÷ 9.7)²  ≈ 1 %  (1 part in 95)", { "font-size": 14 });
  body += text(tx, 166, "Earth-sized:    (1 ÷ 109)²  ≈ 0.008 %  (1 part in 12 000)", { "font-size": 14 });
  body += text(tx, 206, "Turned around: Rₚ = R★ × √depth", { "font-size": 14, "font-weight": "bold" });
  body += text(tx, 232, "We get the star's radius from its spectrum.", { "font-size": 13, fill: C.muted });
  save("depth-area.svg", svg(W, H, "Transit depth is an area ratio",
    "The Sun drawn with Jupiter and Earth to scale in front of it. The fraction of light blocked is the planet's disk area divided by the star's: about 1 percent for Jupiter and 0.008 percent for Earth.", body, starDefs));
}

// 3. Why only lined-up orbits transit ───────────────────────────────────────────
{
  const W = 660, H = 300, cx = 200, cy = 150, a = 120, R = 22;
  let body = "";
  // band of directions from which the planet crosses the star
  const half = Math.atan((R + 4) / a);
  const L = 440;
  body += path(`M${cx} ${cy} L${cx + L * Math.cos(half)} ${cy - L * Math.sin(half)} L${cx + L * Math.cos(half)} ${cy + L * Math.sin(half)} Z`, { fill: C.earth, "fill-opacity": 0.13 });
  body += path(`M${cx} ${cy} L${cx - L * Math.cos(half)} ${cy - L * Math.sin(half)} L${cx - L * Math.cos(half)} ${cy + L * Math.sin(half)} Z`, { fill: C.earth, "fill-opacity": 0.13 });
  body += `<ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${a}" fill="none" stroke="${C.planet}" stroke-dasharray="5 4"/>`;
  body += starDisk(cx, cy, R);
  body += circle(cx + a, cy, 6, { fill: "#2b2b2b" });
  body += text(cx + a + 10, cy - 10, "planet", { "font-size": 12 });
  body += arrow(cx, cy + 4, cx, cy + a - 4, C.ink, 1, true);
  body += text(cx + 6, cy + a / 2 + 18, "a", { "font-style": "italic" });
  body += arrow(cx - R, cy - R - 10, cx + R, cy - R - 10, C.ink, 1, true);
  body += text(cx, cy - R - 16, "2 R★", { "text-anchor": "middle", "font-size": 12 });
  body += text(cx, 22, "Side view of the orbit (not to scale)", { "text-anchor": "middle", "font-weight": "bold", "font-size": 13 });
  // observers
  body += text(560, cy + 5, "👁", { "font-size": 22, "text-anchor": "middle" });
  body += text(560, cy + 30, "A: sees transits", { "text-anchor": "middle", "font-size": 12, fill: C.earth });
  body += text(560, 52, "👁", { "font-size": 22, "text-anchor": "middle" });
  body += text(560, 76, "B: planet passes", { "text-anchor": "middle", "font-size": 12, fill: C.red });
  body += text(560, 92, "above the star", { "text-anchor": "middle", "font-size": 12, fill: C.red });
  body += text(430, 250, "Only observers inside the green band see the planet", { "font-size": 13, "text-anchor": "middle" });
  body += text(430, 268, "cross the star. Its width is about 2 R★, so the chance", { "font-size": 13, "text-anchor": "middle" });
  body += text(430, 286, "that a random orbit lines up is about R★ ÷ a.", { "font-size": 13, "text-anchor": "middle" });
  save("alignment.svg", svg(W, H, "Only lined-up orbits show transits",
    "Side view of an orbit around a star. Only observers inside a thin band, about two star radii wide around the orbital plane, see the planet cross the star. The chance is about the star's radius divided by the orbit size.", body, starDefs));
}

// 4. Impact parameter and dip shape ─────────────────────────────────────────────
{
  const W = 680, H = 300, R = 48, k = 0.16;
  let body = "";
  const cases = [[0, "Through the middle"], [0.6, "Off center"], [1.02, "Grazing"], [1.35, "Misses"]];
  cases.forEach(([b, title], i) => {
    const cx = 90 + i * 168, cy = 100;
    body += text(cx, 18, title, { "text-anchor": "middle", "font-weight": "bold", "font-size": 13 });
    body += starDisk(cx, cy, R);
    body += line(cx - 75, cy - b * R, cx + 75, cy - b * R, { stroke: C.planet, "stroke-dasharray": "4 3" });
    body += circle(cx - 0.5 * R, cy - b * R, k * R, { fill: "#2b2b2b" });
    // light curve
    const x0 = cx - 70, x1 = cx + 70, y0 = 190, sc = 1450;
    body += rect(x0, 170, x1 - x0, 90, { fill: "#fafafa", stroke: C.grid });
    let d = "";
    for (let x = x0; x <= x1; x++) { const z = Math.hypot(((x - cx) / 70) * 1.6, b); d += `${x === x0 ? "M" : "L"}${x} ${(y0 + sc * blocked(z, k) * 1.6).toFixed(1)} `; }
    body += path(d, { fill: "none", stroke: C.curve, "stroke-width": 2.2 });
    const shape = ["long, flat bottom", "shorter", "short, V-shaped", "no dip"][i];
    body += text(cx, 280, shape, { "text-anchor": "middle", "font-size": 12 });
  });
  save("dip-shapes.svg", svg(W, H, "How the path across the star changes the dip",
    "Four paths of a planet across its star, from through the middle to missing it, with the light curve each one makes: long and flat-bottomed, shorter, short and V-shaped, and no dip at all.", body, starDefs));
}

// 5. Folding a noisy light curve ───────────────────────────────────────────────
{
  const W = 660, H = 380, P = 3.1, depth = 0.0016, dur = 0.14, sigma = 0.0012;
  const rand = mulberry(11);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
  const pts = [];
  for (let t = 0; t < 4 * P; t += 0.01) {
    const ph = ((t + 0.5) % P) / P - 0.5 / P * 0; // transit at t = P - 0.5 + nP
    const dt = ((t - (P - 0.5)) % P + P * 1.5) % P - P / 2;
    pts.push({ t, dt, f: (Math.abs(dt) < dur / 2 ? -depth : 0) + sigma * gauss() });
  }
  let body = "";
  const tx0 = 50, tx1 = 630, ty = 85, sy = 18000;
  body += text(tx0, 22, "1. Raw measurements: four shallow transits hidden in the noise", { "font-weight": "bold", "font-size": 13 });
  for (const p of pts) body += circle((tx0 + (p.t / (4 * P)) * (tx1 - tx0)).toFixed(1), (ty - p.f * sy).toFixed(1), 1.1, { fill: C.muted });
  for (let n = 0; n < 4; n++) {
    const x = tx0 + ((P - 0.5 + n * P) / (4 * P)) * (tx1 - tx0);
    if (x < tx1) body += path(`M${x} ${ty + 46} l-5 8 l10 0 Z`, { fill: C.red });
  }
  body += text(tx1, ty + 66, "▲ where the transits are (hard to see!)", { "text-anchor": "end", "font-size": 12, fill: C.red });
  // folded
  const fx0 = 140, fx1 = 520, fy = 255, span = 0.5;
  body += text(tx0, 190, "2. Folded on the right period: every transit stacked, then averaged", { "font-weight": "bold", "font-size": 13 });
  for (const p of pts) if (Math.abs(p.dt) < span / 2) body += circle((fx0 + (p.dt / span + 0.5) * (fx1 - fx0)).toFixed(1), (fy - p.f * sy * 0.8).toFixed(1), 1.1, { fill: C.muted });
  const bins = 20; let d = "";
  for (let i = 0; i < bins; i++) {
    const lo = -span / 2 + (i * span) / bins, hi = lo + span / bins;
    const sel = pts.filter((p) => p.dt >= lo && p.dt < hi);
    const m = sel.reduce((s, p) => s + p.f, 0) / sel.length;
    d += `${i ? "L" : "M"}${(fx0 + (((lo + hi) / 2) / span + 0.5) * (fx1 - fx0)).toFixed(1)} ${(fy - m * sy * 0.8).toFixed(1)} `;
  }
  body += path(d, { fill: "none", stroke: C.curve, "stroke-width": 3 });
  body += text(fx1 + 10, fy - 4, "average of", { "font-size": 12, fill: C.curve });
  body += text(fx1 + 10, fy + 12, "the stacked points", { "font-size": 12, fill: C.curve });
  body += text((fx0 + fx1) / 2, 360, "time from mid-transit", { "text-anchor": "middle", "font-size": 12 });
  body += text(W / 2, 376, "Averaging n points shrinks the scatter by √n, so the dip appears.", { "text-anchor": "middle", "font-size": 12, fill: C.muted });
  save("folding-transit.svg", svg(W, H, "Folding a noisy light curve",
    "Top: a noisy light curve over four orbits in which shallow transits cannot be seen. Bottom: the same points folded on the period and averaged, which reveals a clear dip.", body));
}
