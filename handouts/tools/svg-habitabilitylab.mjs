// Writes the Habitability Lab handout diagrams to ../HabitabilityLab/svg/.
//   node handouts/tools/svg-habitabilitylab.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { C, svg, text, arrow, line, circle, path, rect } from "./svglib.mjs";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../HabitabilityLab/svg");
mkdirSync(out, { recursive: true });
const save = (name, s) => { writeFileSync(`${out}/${name}`, s); console.log("wrote", name); };
const SUN = "#e3a21a", IR = "#c8471d", REFL = "#3d7fc1";

// 1. Absorbs on a disk, radiates from a sphere ────────────────────────────────────
{
  const W = 660, H = 330, cx = 330, cy = 150, R = 70;
  let body = "";
  for (let k = -3; k <= 3; k++) body += arrow(40, cy + k * 22, cx - Math.sqrt(Math.max(0, R * R - (k * 22) ** 2)) - 4, cy + k * 22, SUN, 2.2);
  body += text(40, 50, "Starlight", { fill: SUN, "font-weight": "bold" });
  body += text(40, 68, "S watts per square meter", { fill: SUN, "font-size": 12 });
  body += circle(cx, cy, R, { fill: "#cfe3f7", stroke: C.planet, "stroke-width": 2 });
  body += `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="${R}" fill="${SUN}" fill-opacity="0.35" stroke="${SUN}" stroke-dasharray="4 3"/>`;
  body += line(cx - 4, cy + 40, 200, 262, { stroke: "#9a6a00" });
  body += text(200, 278, "the disk facing the star: area πR²", { "text-anchor": "middle", "font-size": 12, fill: "#9a6a00" });
  for (let k = 0; k < 10; k++) {
    const a = (2 * Math.PI * k) / 10 + 0.3, x1 = cx + (R + 6) * Math.cos(a), y1 = cy + (R + 6) * Math.sin(a);
    if (Math.cos(a) < -0.6) continue;
    body += arrow(x1, y1, cx + (R + 46) * Math.cos(a), cy + (R + 46) * Math.sin(a), IR, 2.2);
  }
  body += text(500, 40, "Infrared out", { fill: IR, "font-weight": "bold" });
  body += text(500, 58, "from the whole sphere:", { fill: IR, "font-size": 12 });
  body += text(500, 74, "area 4πR²", { fill: IR, "font-size": 12 });
  body += text(110, 316, "In: S (1 − A) × πR²", { "text-anchor": "middle", "font-size": 13 });
  body += text(330, 316, "Out: σT⁴ × 4πR²", { "text-anchor": "middle", "font-size": 13 });
  body += text(540, 316, "Balance: σT⁴ = S (1 − A) ÷ 4", { "text-anchor": "middle", "font-size": 13, "font-weight": "bold" });
  save("disk-and-sphere.svg", svg(W, H, "Why the absorbed starlight is divided by four",
    "Starlight falls on the disk the planet presents to its star, area pi R squared, but the planet radiates infrared from its whole sphere, area four pi R squared. At balance the emitted power per square meter is one quarter of the absorbed starlight.", body));
}

// 2. A greenhouse layer ────────────────────────────────────────────────────────────
{
  const W = 660, H = 320;
  let body = "";
  body += rect(0, 250, W, 70, { fill: "#b9a088" });
  body += text(20, 276, "Ground (and oceans)", { fill: "#fff", "font-weight": "bold", "font-size": 13 });
  body += rect(0, 110, W, 90, { fill: "#dfe9f5" });
  body += text(110, 132, "Atmosphere: water vapor, CO₂ … absorb infrared", { "font-size": 13, fill: C.planet });
  body += arrow(90, 20, 90, 246, SUN, 4);
  body += text(102, 40, "Sunlight passes", { fill: "#9a6a00", "font-size": 13 });
  body += text(102, 56, "through the air", { fill: "#9a6a00", "font-size": 13 });
  body += arrow(300, 246, 300, 160, IR, 4);
  body += text(312, 218, "Infrared from the ground", { fill: IR, "font-size": 13 });
  body += text(312, 234, "is absorbed by the air", { fill: IR, "font-size": 13 });
  body += arrow(470, 160, 470, 20, IR, 2.5);
  body += text(482, 40, "Part escapes to space", { fill: IR, "font-size": 13 });
  body += text(482, 56, "from high, cold layers", { fill: IR, "font-size": 13 });
  body += arrow(560, 160, 560, 246, IR, 2.5);
  body += text(574, 214, "Part is sent", { fill: IR, "font-size": 13, "text-anchor": "start" });
  body += text(574, 230, "back down", { fill: IR, "font-size": 13 });
  body += text(W - 20, 300, "More absorbing gas → larger τ → more infrared sent back down → warmer ground", { "text-anchor": "end", "font-size": 13, "font-weight": "bold", fill: "#fff" });
  save("greenhouse-layer.svg", svg(W, H, "How a greenhouse atmosphere warms the ground",
    "Sunlight passes through the atmosphere to the ground. The ground gives off infrared, which gases in the atmosphere absorb. The atmosphere sends part of it to space and part back down, so the ground ends up warmer than a bare rock would.", body));
}

// 3. Habitable-zone map ────────────────────────────────────────────────────────────
{
  const W = 660, H = 270, x0 = 40, x1 = 620, y = 130;
  const X = (d) => x0 + ((Math.log10(d) + 0.7) / 1.2) * (x1 - x0); // 0.2–3.2 AU log
  let body = "";
  body += rect(X(0.2), y - 50, X(0.751) - X(0.2), 100, { fill: "#f6d5cf" });
  body += rect(X(0.751), y - 50, X(0.951) - X(0.751), 100, { fill: "#cfe8cf" });
  body += rect(X(0.951), y - 50, X(1.68) - X(0.951), 100, { fill: "#6cbf6c" });
  body += rect(X(1.68), y - 50, X(1.77) - X(1.68), 100, { fill: "#cfe8cf" });
  body += rect(X(1.77), y - 50, X(3.16) - X(1.77), 100, { fill: "#d6e4f4" });
  body += circle(x0 - 10, y, 22, { fill: C.star, stroke: C.starEdge });
  body += text((X(0.2) + X(0.751)) / 2, y - 26, "Too hot", { "text-anchor": "middle", "font-weight": "bold", fill: C.red });
  body += text((X(0.951) + X(1.68)) / 2, y - 26, "Conservative zone", { "text-anchor": "middle", "font-weight": "bold", fill: "#14532d" });
  body += text((X(1.77) + X(3.16)) / 2, y - 26, "Too cold", { "text-anchor": "middle", "font-weight": "bold", fill: C.blue });
  for (const [n, d] of [["Mercury", 0.387], ["Venus", 0.723], ["Earth", 1], ["Mars", 1.524]]) {
    body += circle(X(d), y + 10, 6, { fill: C.planet, stroke: "#fff" });
    body += text(X(d), y + 34, n, { "text-anchor": "middle", "font-size": 12 });
  }
  body += line(X(0.951), y + 52, X(0.951), y + 78, { stroke: C.ink });
  body += text(X(0.951), y + 94, "inner edge:", { "text-anchor": "middle", "font-size": 12 });
  body += text(X(0.951), y + 110, "runaway greenhouse", { "text-anchor": "middle", "font-size": 12 });
  body += line(X(1.68), y + 52, X(1.68), y + 78, { stroke: C.ink });
  body += text(X(1.68), y + 94, "outer edge:", { "text-anchor": "middle", "font-size": 12 });
  body += text(X(1.68), y + 110, "maximum greenhouse", { "text-anchor": "middle", "font-size": 12 });
  body += text(X(0.751), y - 58, "optimistic edges ↓", { "text-anchor": "middle", "font-size": 11, fill: C.muted });
  body += text(X(1.77), y - 58, "↓", { "text-anchor": "middle", "font-size": 11, fill: C.muted });
  body += text(W / 2, 20, "The Sun's habitable zone today (distance from the Sun, log scale)", { "text-anchor": "middle", "font-weight": "bold" });
  save("habitable-zone.svg", svg(W, H, "The Sun's habitable zone",
    "Distances from the Sun on a log scale. The conservative habitable zone runs from about 0.95 AU (runaway greenhouse) to 1.68 AU (maximum greenhouse), with thin optimistic bands on either side. Venus lies on the hot side, Earth and Mars inside.", body));
}

// 4. The fast tail escapes ─────────────────────────────────────────────────────────
{
  const W = 660, H = 300, x0 = 60, x1 = 620, y0 = 250, vmax = 14;
  const X = (v) => x0 + (v / vmax) * (x1 - x0);
  const mb = (v, vp) => (v * v / vp ** 3) * Math.exp(-((v / vp) ** 2)); // ∝ Maxwell–Boltzmann
  const curve = (vp, color, label, dash = "") => {
    let d = "", peak = mb(vp, vp);
    for (let v = 0; v <= vmax; v += 0.05) d += `${v ? "L" : "M"}${X(v).toFixed(1)} ${(y0 - (mb(v, vp) / peak) * 170 * (vp < 2 ? 1 : 0.45)).toFixed(1)} `;
    return path(d, { fill: "none", stroke: color, "stroke-width": 2.5, ...(dash ? { "stroke-dasharray": dash } : {}) });
  };
  const vpN2 = 0.77, vpH2 = 2.87, vesc = 11.2;
  // shaded tail of H2 beyond a lowered escape speed for illustration
  let tail = `M${X(6)} ${y0} `;
  for (let v = 6; v <= vmax; v += 0.05) tail += `L${X(v).toFixed(1)} ${(y0 - (mb(v, vpH2) / mb(vpH2, vpH2)) * 170 * 0.45).toFixed(1)} `;
  tail += `L${X(vmax)} ${y0} Z`;
  let body = path(tail, { fill: C.red, "fill-opacity": 0.25 });
  body += curve(vpN2, C.planet, "N₂");
  body += curve(vpH2, C.red, "H₂", "6 4");
  body += line(x0, y0, x1, y0, { stroke: C.ink });
  for (let v = 0; v <= 14; v += 2) { body += line(X(v), y0, X(v), y0 + 5, { stroke: C.ink }); body += text(X(v), y0 + 20, String(v), { "text-anchor": "middle", "font-size": 12 }); }
  body += text((x0 + x1) / 2, y0 + 42, "Molecule speed (km/s), upper atmosphere at 1000 K", { "text-anchor": "middle", "font-size": 13 });
  body += line(X(vesc), 40, X(vesc), y0, { stroke: C.ink, "stroke-width": 2 });
  body += text(X(vesc) - 4, 36, "Earth's escape speed 11.2 km/s", { "text-anchor": "end", "font-size": 12 });
  body += line(X(6), 90, X(6), y0, { stroke: C.red, "stroke-dasharray": "3 3" });
  body += text(X(6) + 4, 88, "a smaller planet's escape speed", { "font-size": 12, fill: C.red });
  body += text(X(1.3), 70, "N₂ (heavy): slow,", { fill: C.planet, "font-size": 12 });
  body += text(X(1.3), 86, "narrow spread", { fill: C.planet, "font-size": 12 });
  body += text(X(2.0), 128, "H₂ (light): fast, wide spread", { fill: C.red, "font-size": 12 });
  body += text(X(8.8), 215, "fast tail escapes", { fill: C.red, "font-size": 12, "text-anchor": "middle" });
  save("escape-tail.svg", svg(W, H, "Fast molecules escape",
    "Speed distributions of nitrogen and hydrogen molecules at 1000 kelvin. Nitrogen molecules are slow, far below Earth's escape speed. Hydrogen's wider distribution has a fast tail; for a smaller planet with a lower escape speed, the shaded part of that tail escapes.", body));
}
