// Writes the Stellar Wobble handout diagrams to ../StellarWobble/svg/.
//   node handouts/tools/svg-stellarwobble.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { C, svg, text, arrow, line, circle, path, rect, mulberry } from "./svglib.mjs";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../StellarWobble/svg");
mkdirSync(out, { recursive: true });
const save = (name, s) => { writeFileSync(`${out}/${name}`, s); console.log("wrote", name); };

// 1. Doppler wavefronts from a moving star ────────────────────────────────────
{
  const W = 700, H = 330, sx = 375, sy = 165, beta = 0.4;
  let body = "";
  for (let k = 1; k <= 4; k++) {
    const r = 38 * k;
    body += circle(sx - beta * r, sy, r, { fill: "none", stroke: C.wave, "stroke-width": 1.6 });
  }
  body += circle(sx, sy, 13, { fill: C.star, stroke: C.starEdge, "stroke-width": 1.5 });
  body += arrow(sx + 16, sy, sx + 70, sy, C.velocity, 3);
  body += text(sx + 44, sy + 30, "star's motion", { fill: C.velocity, "font-size": 13, "text-anchor": "middle" });
  body += text(W / 2, 14, "Not to scale: the star's speed is hugely exaggerated", { "font-size": 12, fill: C.muted, "text-anchor": "middle" });
  // ahead
  body += text(625, 140, "Ahead:", { fill: C.blue, "font-weight": "bold", "text-anchor": "middle" });
  body += text(625, 160, "crests bunched up", { fill: C.blue, "text-anchor": "middle", "font-size": 13 });
  body += text(625, 178, "shorter wavelength", { fill: C.blue, "text-anchor": "middle", "font-size": 13 });
  body += text(625, 196, "→ blueshift", { fill: C.blue, "text-anchor": "middle", "font-size": 13 });
  // behind
  body += text(70, 140, "Behind:", { fill: C.red, "font-weight": "bold", "text-anchor": "middle" });
  body += text(70, 160, "crests spread out", { fill: C.red, "text-anchor": "middle", "font-size": 13 });
  body += text(70, 178, "longer wavelength", { fill: C.red, "text-anchor": "middle", "font-size": 13 });
  body += text(70, 196, "→ redshift", { fill: C.red, "text-anchor": "middle", "font-size": 13 });
  // spacing brackets
  body += line(sx + 0.6 * 38 * 3, 250, sx + 0.6 * 38 * 4, 250, { stroke: C.blue, "stroke-width": 2 });
  body += line(sx - 1.4 * 38 * 3, 250, sx - 1.4 * 38 * 4, 250, { stroke: C.red, "stroke-width": 2 });
  body += text(sx + 0.6 * 38 * 3.5, 268, "λ short", { fill: C.blue, "font-size": 12, "text-anchor": "middle" });
  body += text(sx - 1.4 * 38 * 3.5, 268, "λ long", { fill: C.red, "font-size": 12, "text-anchor": "middle" });
  body += text(W / 2, H - 12, "Each circle is a crest sent out when the star was at that circle's center.", { "font-size": 13, fill: C.ink, "text-anchor": "middle" });
  save("doppler-waves.svg", svg(W, H, "Doppler effect from a moving star",
    "Wavefronts from a star moving to the right: crests are closer together ahead of the star (blueshift) and farther apart behind it (redshift).", body));
}

// 2. Spectral line shift ───────────────────────────────────────────────────────
{
  const W = 620, H = 230, x0 = 70, x1 = 590;
  const xOf = (lam) => x0 + ((lam - 400) / 300) * (x1 - x0);
  let defs = `<linearGradient id="spec" x1="0" x2="1">${[
    [0, "#7a3fb0"], [0.12, "#3b4fd8"], [0.3, "#16a6e0"], [0.42, "#2fc46b"], [0.55, "#c8d62b"], [0.65, "#f2b01e"], [0.8, "#ef6a1f"], [1, "#c81e1e"],
  ].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
  let body = "";
  const lines = [434.05, 486.13, 589.0, 656.28];
  const frac = 0.02; // v/c, hugely exaggerated
  for (const [y, label, f] of [[40, "Lab", 0], [100, "Star", frac]]) {
    body += text(x0 - 10, y + 22, label, { "text-anchor": "end", "font-weight": "bold" });
    body += rect(x0, y, x1 - x0, 34, { fill: "url(#spec)", stroke: C.ink });
    for (const lam of lines) body += rect(xOf(lam * (1 + f)) - 2, y, 4, 34, { fill: "#111" });
  }
  for (const lam of lines) {
    body += line(xOf(lam), 74, xOf(lam), 100, { stroke: C.ink, "stroke-dasharray": "3 3" });
    body += arrow(xOf(lam), 152, xOf(lam * (1 + frac)), 152, C.red, 2);
  }
  body += text(xOf(656.28 * (1 + frac / 2)), 172, "Δλ", { fill: C.red, "text-anchor": "middle", "font-style": "italic" });
  for (const lam of [400, 450, 500, 550, 600, 650, 700]) {
    body += text(xOf(lam), 196, String(lam), { "font-size": 12, "text-anchor": "middle", fill: C.muted });
  }
  body += text((x0 + x1) / 2, 216, "Wavelength (nm)   →  longer, redder", { "font-size": 13, "text-anchor": "middle" });
  body += text(x0, 26, "Every line moves by the same fraction of its wavelength: Δλ / λ = vᵣ / c   (exaggerated)", { "font-size": 13 });
  save("line-shift.svg", svg(W, H, "Redshifted absorption lines",
    "A star's absorption lines compared with the same lines measured in the lab. Moving away, every line shifts toward longer wavelength by the fraction v/c.", body, defs));
}

// 3. Barycenter ─────────────────────────────────────────────────────────────────
{
  const W = 660, H = 320, cx = 200, cy = 160, aStar = 34, aPlanet = 140;
  let body = "";
  body += circle(cx, cy, aPlanet, { fill: "none", stroke: C.planet, "stroke-dasharray": "6 5", "stroke-width": 1.5 });
  body += circle(cx, cy, aStar, { fill: "none", stroke: C.starEdge, "stroke-dasharray": "4 4", "stroke-width": 1.5 });
  body += circle(cx - aStar, cy, 26, { fill: C.star, stroke: C.starEdge, "stroke-width": 1.5, "fill-opacity": 0.92 });
  body += circle(cx + aPlanet, cy, 9, { fill: C.planet });
  body += text(cx + aPlanet, cy + 30, "planet", { "text-anchor": "middle", fill: C.planet });
  body += text(cx - aStar, cy + 44, "star", { "text-anchor": "middle", fill: C.starEdge });
  body += path(`M${cx - 6} ${cy - 6} L${cx + 6} ${cy + 6} M${cx - 6} ${cy + 6} L${cx + 6} ${cy - 6}`, { stroke: C.cm, "stroke-width": 2.5 });
  body += text(cx + 8, cy - 12, "center of mass", { fill: C.cm, "font-size": 13 });
  body += line(cx, cy + 3, cx + aPlanet - 10, cy + 3, { stroke: C.planet, "stroke-width": 1.2 });
  body += text(cx + aPlanet / 2 + 10, cy + 20, "aₚ", { fill: C.planet, "font-style": "italic" });
  body += line(cx - aStar, cy - 3, cx, cy - 3, { stroke: C.starEdge, "stroke-width": 1.2 });
  body += text(cx - aStar / 2, cy - 36, "a★", { fill: C.starEdge, "font-style": "italic", "text-anchor": "middle" });
  // velocities: star moves down when planet moves up (opposite sides)
  body += arrow(cx + aPlanet + 14, cy, cx + aPlanet + 14, cy - 70, C.planet, 2.5);
  body += text(cx + aPlanet + 20, cy - 74, "vₚ", { fill: C.planet, "font-style": "italic" });
  body += arrow(cx - aStar - 34, cy - 4, cx - aStar - 34, cy + 22, C.velocity, 2.5);
  body += text(cx - aStar - 56, cy + 22, "v★", { fill: C.velocity, "font-style": "italic" });
  const tx = 420;
  body += text(tx, 40, "Both bodies:", { "font-weight": "bold" });
  body += text(tx, 62, "• circle the center of mass", { "font-size": 13 });
  body += text(tx, 82, "• with the same period P", { "font-size": 13 });
  body += text(tx, 102, "• always on opposite sides", { "font-size": 13 });
  body += text(tx, 140, "Balance:", { "font-weight": "bold" });
  body += text(tx, 164, "M★ a★ = Mₚ aₚ", { "font-size": 15 });
  body += text(tx, 188, "M★ v★ = Mₚ vₚ", { "font-size": 15 });
  body += text(tx, 230, "The star's circle is", { "font-size": 13 });
  body += text(tx, 248, "drawn far too big:", { "font-size": 13 });
  body += text(tx, 266, "for Sun + Jupiter it is", { "font-size": 13 });
  body += text(tx, 284, "about the Sun's radius.", { "font-size": 13 });
  save("barycenter.svg", svg(W, H, "Star and planet orbit their center of mass",
    "A star and a planet on opposite sides of their common center of mass, each on its own circle with the same period. M-star times a-star equals M-planet times a-planet.", body));
}

// 4. Radial-velocity curve ─────────────────────────────────────────────────────
{
  const W = 640, H = 300, x0 = 80, x1 = 600, y0 = 150, K = 85;
  const P = (x1 - x0) / 2.25;
  let body = "";
  body += rect(x0, y0 - 120, x1 - x0, 120, { fill: C.redBg });
  body += rect(x0, y0, x1 - x0, 120, { fill: C.blueBg });
  body += text(x1 - 8, y0 - 106, "+ moving away from us (redshift)", { fill: C.red, "font-size": 13, "text-anchor": "end" });
  body += text(x1 - 8, y0 + 112, "− moving toward us (blueshift)", { fill: C.blue, "font-size": 13, "text-anchor": "end" });
  body += line(x0, y0, x1, y0, { stroke: C.ink });
  body += line(x0, y0 - 120, x0, y0 + 120, { stroke: C.ink });
  let d = "";
  for (let x = x0; x <= x1; x += 2) d += `${x === x0 ? "M" : "L"}${x} ${(y0 - K * Math.sin((2 * Math.PI * (x - x0)) / P)).toFixed(1)} `;
  body += path(d, { fill: "none", stroke: C.curve, "stroke-width": 2.5 });
  const xp1 = x0 + P / 4, xp2 = xp1 + P;
  body += line(xp1, y0 - K - 18, xp1, y0 - K - 4, { stroke: C.ink });
  body += line(xp2, y0 - K - 18, xp2, y0 - K - 4, { stroke: C.ink });
  body += arrow(xp1 + 4, y0 - K - 11, xp2 - 4, y0 - K - 11, C.ink, 1.3, true);
  body += text((xp1 + xp2) / 2, y0 - K - 18, "period P", { "text-anchor": "middle", "font-size": 13 });
  const xk = xp2 + 40;
  body += line(xk - 30, y0 - K, xk + 6, y0 - K, { stroke: C.ink, "stroke-dasharray": "3 3" });
  body += arrow(xk, y0, xk, y0 - K, C.ink, 1.3, true);
  body += text(xk + 6, y0 - K / 2 + 5, "K (amplitude)", { "font-size": 13 });
  body += text(40, y0, "radial velocity vᵣ", { "text-anchor": "middle", "font-size": 13, transform: `rotate(-90 40 ${y0})` });
  body += text(x1, y0 + 140, "time →", { "text-anchor": "end", "font-size": 13 });
  save("rv-curve.svg", svg(W, H, "Radial-velocity curve",
    "A sine-shaped radial-velocity curve. Positive values mean the star moves away (redshift), negative toward us (blueshift). The period P is the time between peaks; the amplitude K is the height of a peak.", body));
}

// 5. Inclination ─────────────────────────────────────────────────────────────────
{
  const W = 660, H = 290;
  let body = "";
  const panels = [[110, 90, "Edge-on, i = 90°", "K = v★ (full signal)"], [330, 40, "Tilted, i = 40°", "K = v★ sin i"], [550, 0, "Face-on, i = 0°", "K = 0: no signal"]];
  for (const [cx, inc, title, caption] of panels) {
    const cy = 130;
    const tilt = 90 - inc; // angle of the orbital plane from the line of sight, degrees
    body += text(cx, 30, title, { "text-anchor": "middle", "font-weight": "bold" });
    body += `<g transform="rotate(${-tilt} ${cx} ${cy})">` + `<ellipse cx="${cx}" cy="${cy}" rx="55" ry="8" fill="${C.orbitFill}" stroke="${C.planet}" stroke-dasharray="5 4"/>` + "</g>";
    body += circle(cx, cy, 9, { fill: C.star, stroke: C.starEdge });
    // star velocity along the plane, length 60, and its projection on the line of sight (horizontal)
    const t = (tilt * Math.PI) / 180, L = 58;
    const vx = L * Math.cos(t), vy = -L * Math.sin(t);
    if (inc > 0) {
      body += arrow(cx, cy, cx + vx, cy + vy, C.velocity, 2.5);
      body += line(cx + vx, cy + vy, cx + vx, 190, { stroke: C.muted, "stroke-dasharray": "3 3" });
      if (inc < 90) body += text(cx + vx + 4, cy + vy - 2, "v★", { fill: C.velocity, "font-style": "italic", "font-size": 13 });
      body += arrow(cx, 190, cx + vx, 190, C.red, 3);
      body += text(cx + 20, 210, "part along the line of sight", { "font-size": 11, "text-anchor": "middle", fill: C.red });
    } else {
      body += arrow(cx, cy, cx, cy - L, C.velocity, 2.5);
      body += text(cx + 6, cy - L + 4, "v★", { fill: C.velocity, "font-style": "italic", "font-size": 13 });
      body += text(cx, 210, "nothing along the line of sight", { "font-size": 11, "text-anchor": "middle", fill: C.red });
    }
    body += text(cx, 236, caption, { "text-anchor": "middle", "font-size": 13 });
  }
  body += arrow(30, 262, 640, 262, C.earth, 2);
  body += text(636, 282, "line of sight: to Earth", { fill: C.earth, "text-anchor": "end", "font-size": 13 });
  save("inclination.svg", svg(W, H, "Orbit tilt and the measured wobble",
    "Three side views with Earth to the right. Edge-on, the star's whole velocity points along the line of sight. Tilted, only the part v sin i does. Face-on, none does, so there is no Doppler signal.", body));
}

// 6. Folding ───────────────────────────────────────────────────────────────────
{
  const W = 660, H = 400, P = 4.23, K = 56, sigma = 6;
  const rand = mulberry(7);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
  const pts = [];
  for (let n = 0; n < 13; n++) {
    const t = n * 1.0 + 0.4 + 0.3 * (rand() - 0.5);
    pts.push({ t, v: K * Math.sin((2 * Math.PI * t) / P) + sigma * gauss() });
  }
  const colors = [C.s1, C.s2, C.s3, C.s4];
  const marker = (k, x, y) => {
    const c = colors[k % 4];
    if (k % 4 === 0) return circle(x, y, 4.5, { fill: c });
    if (k % 4 === 1) return rect(x - 4, y - 4, 8, 8, { fill: c });
    if (k % 4 === 2) return path(`M${x} ${y - 5.5} L${x + 5} ${y + 4} L${x - 5} ${y + 4} Z`, { fill: c });
    return path(`M${x} ${y - 5.5} L${x + 5} ${y} L${x} ${y + 5.5} L${x - 5} ${y} Z`, { fill: c });
  };
  let body = "";
  // top: time
  const tx0 = 60, tx1 = 620, ty = 100, sc = 0.8;
  const xT = (t) => tx0 + (t / 13.5) * (tx1 - tx0);
  body += text(tx0, 22, "1. Measurements night after night (time in days)", { "font-weight": "bold", "font-size": 13 });
  body += line(tx0, ty, tx1, ty, { stroke: C.grid });
  for (let k = 0; k <= 3; k++) {
    body += line(xT(k * P), ty - 62, xT(k * P), ty + 62, { stroke: C.muted, "stroke-dasharray": "4 4" });
    if (k < 3) body += text(xT(k * P + P / 2), ty + 78, `orbit ${k + 1}`, { fill: colors[k], "text-anchor": "middle", "font-size": 12 });
  }
  for (const p of pts) body += marker(Math.floor(p.t / P), xT(p.t), ty - p.v * sc);
  // bottom: phase
  const px0 = 200, px1 = 520, py = 300;
  const xP = (ph) => px0 + ph * (px1 - px0);
  body += text(tx0, 200, "2. Fold: plot each point at its phase = fraction part of (t ÷ P)", { "font-weight": "bold", "font-size": 13 });
  body += line(px0, py, px1, py, { stroke: C.grid });
  body += line(px0, py - 62, px0, py + 62, { stroke: C.grid });
  let d = "";
  for (let i = 0; i <= 100; i++) d += `${i ? "L" : "M"}${xP(i / 100).toFixed(1)} ${(py - K * sc * Math.sin(2 * Math.PI * i / 100)).toFixed(1)} `;
  body += path(d, { fill: "none", stroke: C.curve, "stroke-width": 1.5, "stroke-dasharray": "5 4" });
  for (const p of pts) body += marker(Math.floor(p.t / P), xP((p.t / P) % 1), py - p.v * sc);
  for (const ph of [0, 0.5, 1]) body += text(xP(ph), py + 80, String(ph), { "text-anchor": "middle", "font-size": 12, fill: C.muted });
  body += text((px0 + px1) / 2, py + 96, "phase", { "text-anchor": "middle", "font-size": 12 });
  body += text(px1 + 14, py - 10, "With the right P,", { "font-size": 12 });
  body += text(px1 + 14, py + 6, "all orbits stack", { "font-size": 12 });
  body += text(px1 + 14, py + 22, "on one curve.", { "font-size": 12 });
  save("folding.svg", svg(W, H, "Folding data on the period",
    "Thirteen nightly measurements spread over three orbits (top) are replotted against orbital phase (bottom). With the correct period, the points from every orbit fall on one sine curve.", body));
}
