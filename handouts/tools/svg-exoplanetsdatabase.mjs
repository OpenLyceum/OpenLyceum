// Writes the Exoplanets Database handout diagrams to ../ExoplanetsDatabase/svg/.
//   node handouts/tools/svg-exoplanetsdatabase.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { C, svg, text, line, circle, path, rect, mulberry } from "./svglib.mjs";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../ExoplanetsDatabase/svg");
mkdirSync(out, { recursive: true });
const save = (name, s) => { writeFileSync(`${out}/${name}`, s); console.log("wrote", name); };
const M = { transit: "#1f77b4", rv: "#d9711c", micro: "#2a9d55", imaging: "#b5478f" };

// 1. Where each method can see (schematic) ──────────────────────────────────────
{
  const W = 660, H = 420, x0 = 80, x1 = 600, y0 = 360, y1 = 30;
  const ax = [-2, 3], ay = [-1, 4]; // log10 au, log10 Earth masses
  const X = (a) => x0 + ((Math.log10(a) - ax[0]) / (ax[1] - ax[0])) * (x1 - x0);
  const Y = (m) => y0 - ((Math.log10(m) - ay[0]) / (ay[1] - ay[0])) * (y0 - y1);
  let body = "";
  // RV: K = 1 m/s around a Sun-like star → M = 11.2 M⊕ √a, out to about 10 au (decades of data)
  let rv = `M${X(0.01)} ${Y(11.2 * 0.1)} `;
  for (let la = -2; la <= 1.001; la += 0.05) rv += `L${X(10 ** la).toFixed(1)} ${Y(11.2 * Math.sqrt(10 ** la)).toFixed(1)} `;
  rv += `L${X(10)} ${Y(1e4)} L${X(0.01)} ${Y(1e4)} Z`;
  body += path(rv, { fill: M.rv, "fill-opacity": 0.16, stroke: M.rv, "stroke-width": 1.5 });
  // Transit: close orbits (a ≲ 1 au), planets bigger than about Earth
  body += path(`M${X(0.01)} ${Y(0.5)} L${X(1)} ${Y(1.5)} L${X(1)} ${Y(1e4)} L${X(0.01)} ${Y(1e4)} Z`, { fill: M.transit, "fill-opacity": 0.13, stroke: M.transit, "stroke-width": 1.5, "stroke-dasharray": "6 4" });
  // Microlensing: about 0.5–10 au, down to about Earth mass
  body += path(`M${X(0.5)} ${Y(3)} L${X(1.5)} ${Y(0.8)} L${X(10)} ${Y(2)} L${X(15)} ${Y(1e4)} L${X(0.5)} ${Y(1e4)} Z`, { fill: M.micro, "fill-opacity": 0.13, stroke: M.micro, "stroke-width": 1.5, "stroke-dasharray": "2 3" });
  // Imaging: far out, very massive
  body += path(`M${X(8)} ${Y(1e4)} L${X(8)} ${Y(1500)} L${X(1000)} ${Y(600)} L${X(1000)} ${Y(1e4)} Z`, { fill: M.imaging, "fill-opacity": 0.18, stroke: M.imaging, "stroke-width": 1.5 });
  // axes
  body += rect(x0, y1, x1 - x0, y0 - y1, { fill: "none", stroke: C.ink });
  for (let la = ax[0]; la <= ax[1]; la++) { body += line(X(10 ** la), y0, X(10 ** la), y0 + 5, { stroke: C.ink }); body += text(X(10 ** la), y0 + 20, ["0.01", "0.1", "1", "10", "100", "1000"][la + 2], { "text-anchor": "middle", "font-size": 12 }); }
  for (let lm = ay[0]; lm <= ay[1]; lm++) { body += line(x0 - 5, Y(10 ** lm), x0, Y(10 ** lm), { stroke: C.ink }); body += text(x0 - 8, Y(10 ** lm) + 4, ["0.1", "1", "10", "100", "1000", "10 000"][lm + 1], { "text-anchor": "end", "font-size": 12 }); }
  body += text((x0 + x1) / 2, y0 + 40, "Distance from the star (au), log scale", { "text-anchor": "middle", "font-size": 13 });
  body += text(22, (y0 + y1) / 2, "Planet mass (Earth = 1), log scale", { "text-anchor": "middle", "font-size": 13, transform: `rotate(-90 22 ${(y0 + y1) / 2})` });
  // labels
  body += text(X(0.013), Y(4000), "Radial velocity", { fill: M.rv, "font-weight": "bold", "font-size": 13 });
  body += text(X(0.013), Y(2200), "(star wobble ≥ 1 m/s)", { fill: M.rv, "font-size": 11 });
  body += text(X(0.013), Y(3), "Transit", { fill: M.transit, "font-weight": "bold", "font-size": 13 });
  body += text(X(0.013), Y(1.9), "(if the orbit lines up)", { fill: M.transit, "font-size": 11 });
  body += text(X(1.6), Y(1.6), "Microlensing", { fill: M.micro, "font-weight": "bold", "font-size": 13 });
  body += text(X(40), Y(3500), "Imaging", { fill: M.imaging, "font-weight": "bold", "font-size": 13 });
  // Solar System
  for (const [n, a, m] of [["Mercury", 0.387, 0.055], ["Venus", 0.723, 0.815], ["Earth", 1, 1], ["Mars", 1.524, 0.107], ["Jupiter", 5.2, 317.8], ["Saturn", 9.58, 95.2], ["Uranus", 19.2, 14.5], ["Neptune", 30.1, 17.1]]) {
    body += circle(X(a), Y(m), 5, { fill: "#fff", stroke: C.ink, "stroke-width": 1.8 });
    const left = n === "Uranus" || n === "Venus" || n === "Mercury";
    body += text(X(a) + (left ? -8 : 8), Y(m) + 4, n, { "font-size": 11, "text-anchor": left ? "end" : "start" });
  }
  body += text(x1, 18, "Schematic: the edges are approximate and keep moving as instruments improve.", { "text-anchor": "end", "font-size": 11, fill: C.muted });
  save("detection-zones.svg", svg(W, H, "Where each detection method can find planets",
    "Schematic of planet mass against distance from a Sun-like star, both on log scales. Radial velocity finds massive planets out to about 10 au, transits find planets close to their stars, microlensing finds planets a few au out, and imaging finds very massive planets far out. The Solar System planets are marked; Earth lies outside or at the edge of every region.", body));
}

// 2. The odds of lining up ───────────────────────────────────────────────────────
{
  const W = 660, H = 300, n = 200, cols = 20;
  const rand = mulberry(5);
  let body = "";
  const panel = (ox, title, sub, hits, color) => {
    body += text(ox + 135, 24, title, { "text-anchor": "middle", "font-weight": "bold", "font-size": 13 });
    body += text(ox + 135, 42, sub, { "text-anchor": "middle", "font-size": 12, fill: C.muted });
    const chosen = new Set();
    while (chosen.size < hits) chosen.add(Math.floor(rand() * n));
    for (let k = 0; k < n; k++) {
      const x = ox + 10 + (k % cols) * 13, y = 62 + Math.floor(k / cols) * 19;
      body += circle(x, y, chosen.has(k) ? 5.5 : 4, chosen.has(k) ? { fill: color } : { fill: "none", stroke: C.grid });
    }
    body += text(ox + 135, 268, `${hits} of ${n} stars show transits`, { "text-anchor": "middle", "font-size": 13, fill: color, "font-weight": "bold" });
  };
  panel(20, "Hot Jupiter at 0.05 au", "chance of lining up ≈ 10 %", 20, M.transit);
  panel(360, "Earth twin at 1 au", "chance of lining up ≈ 0.5 %", 1, C.red);
  body += text(W / 2, 292, "Each circle is a Sun-like star that has the planet. Filled: its orbit lines up, so we see transits.", { "text-anchor": "middle", "font-size": 12 });
  save("transit-odds.svg", svg(W, H, "Which planets line up for us",
    "Two groups of 200 Sun-like stars. If each has a hot Jupiter at 0.05 au, about 20 show transits. If each has an Earth twin at 1 au, only about 1 does.", body));
}

// 3. Linear versus log scale ─────────────────────────────────────────────────────
{
  const W = 660, H = 230, x0 = 60, x1 = 620;
  const planets = [["Mercury", 0.39], ["Venus", 0.72], ["Earth", 1], ["Mars", 1.52], ["Jupiter", 5.2], ["Saturn", 9.6], ["Uranus", 19.2], ["Neptune", 30.1]];
  let body = "";
  // linear 0–32 au
  body += text(x0, 26, "Linear scale: equal steps add the same amount", { "font-weight": "bold", "font-size": 13 });
  const XL = (a) => x0 + (a / 32) * (x1 - x0);
  body += line(x0, 70, x1, 70, { stroke: C.ink });
  for (const t of [0, 5, 10, 15, 20, 25, 30]) { body += line(XL(t), 70, XL(t), 76, { stroke: C.ink }); body += text(XL(t), 92, String(t), { "text-anchor": "middle", "font-size": 12 }); }
  planets.forEach(([n, a], i) => { body += circle(XL(a), 70, 4.5, { fill: C.planet }); if (a > 2) body += text(XL(a), 58, n, { "text-anchor": "middle", "font-size": 11 }); });
  body += text(XL(0.2), 42, "4 planets crowded here", { "font-size": 11, fill: C.red });
  // log 0.1–100 au
  body += text(x0, 132, "Log scale: equal steps multiply by 10", { "font-weight": "bold", "font-size": 13 });
  const XG = (a) => x0 + ((Math.log10(a) + 1) / 3) * (x1 - x0);
  body += line(x0, 180, x1, 180, { stroke: C.ink });
  for (const t of [0.1, 1, 10, 100]) { body += line(XG(t), 180, XG(t), 188, { stroke: C.ink }); body += text(XG(t), 204, String(t), { "text-anchor": "middle", "font-size": 12 }); }
  for (const t of [0.2, 0.3, 0.5, 2, 3, 5, 20, 30, 50]) body += line(XG(t), 180, XG(t), 184, { stroke: C.ink });
  planets.forEach(([n, a], i) => { body += circle(XG(a), 180, 4.5, { fill: C.planet }); body += text(XG(a), i % 2 ? 158 : 168, n, { "text-anchor": "middle", "font-size": 11 }); });
  body += text(x1, 224, "distance from the Sun (au)", { "text-anchor": "end", "font-size": 12 });
  save("log-scale.svg", svg(W, H, "Linear and log scales",
    "The eight planets' distances from the Sun on a linear scale, where the inner four are crowded together, and on a log scale, where each factor of ten gets the same space and every planet is visible.", body));
}

// 4. Blank histogram grid for the radius counts ───────────────────────────────────
{
  const W = 560, H = 330, x0 = 80, x1 = 520, y0 = 270, y1 = 30, ymax = 800;
  const bins = ["1.0–1.4", "1.4–1.8", "1.8–2.2", "2.2–2.6", "2.6–3.0"];
  let body = rect(x0, y1, x1 - x0, y0 - y1, { fill: "none", stroke: C.ink });
  for (let c = 0; c <= ymax; c += 100) {
    const y = y0 - (c / ymax) * (y0 - y1);
    body += line(x0, y, x1, y, { stroke: c % 200 ? "#e3e6ea" : C.grid, "stroke-width": 1 });
    if (c % 200 === 0) body += text(x0 - 8, y + 4, String(c), { "text-anchor": "end", "font-size": 12 });
  }
  bins.forEach((b, i) => {
    const w = (x1 - x0) / bins.length;
    body += line(x0 + i * w, y0, x0 + i * w, y0 + 6, { stroke: C.ink });
    body += text(x0 + (i + 0.5) * w, y0 + 22, b, { "text-anchor": "middle", "font-size": 12 });
  });
  body += text((x0 + x1) / 2, y0 + 50, "Planet radius (Earth = 1)", { "text-anchor": "middle", "font-size": 13 });
  body += text(24, (y0 + y1) / 2, "Number of planets", { "text-anchor": "middle", "font-size": 13, transform: `rotate(-90 24 ${(y0 + y1) / 2})` });
  save("radius-histogram-grid.svg", svg(W, H, "Grid for a histogram of planet radii",
    "Empty axes for a bar chart: number of transiting planets (0 to 800) in five radius bins from 1.0 to 3.0 Earth radii.", body));
}
