// Answer-key numbers for the Transit Hunter handout, from the formulas in TransitHunter/doc/model.md
// (uniform-disk depth k², transit probability (1+k)/(a/R★), Seager & Mallén-Ornelas durations,
// Kepler's third law, K inverted with the transit's inclination, density 5.514 M/R³).
import { readFileSync } from "node:fs";
const G = 6.674e-11, MSUN = 1.989e30, ME = 5.972e24, MJ = 1.898e27, RSUN = 6.957e8, RE = 6.371e6, RJ = 7.1492e7, AU = 1.496e11, DAY = 86400;
const f = (x, n = 3) => Number(Number(x).toPrecision(n));
const period = (a, ms) => 2 * Math.PI * Math.sqrt((a * AU) ** 3 / (G * ms * MSUN)) / DAY;
const T14 = (P, k, aR, inc = 90) => { const b = aR * Math.cos(inc * Math.PI / 180); const x = Math.sqrt(Math.max(0, (1 + k) ** 2 - b ** 2)) / (aR * Math.sin(inc * Math.PI / 180)); return (P / Math.PI) * Math.asin(Math.min(1, x)); };
const stars = { "Sun-like": [1, 1], "Red dwarf": [0.2, 0.2], "Big hot star": [2, 1.5] };
const planets = { Earth: 1, Neptune: 3.883, Jupiter: 11.21 };

console.log("## Dimming: depth = (Rp/R★)²");
for (const [sn, [rs]] of Object.entries(stars)) for (const [pn, rp] of Object.entries(planets)) {
  const k = rp * RE / (rs * RSUN); const d = k * k;
  console.log(`${sn.padEnd(12)} ${pn.padEnd(8)} k=${f(k)} depth ${f(d * 100)} %  1 part in ${Math.round(1 / d)}${k > 0.6 ? "  (too big: capped)" : ""}`);
}

console.log("\n## Lining Up (Sun-like star): probability (1+k)/(a/R★), tilt limit, edge-on duration");
for (const [pn, rp] of Object.entries(planets)) for (const a of [0.02, 0.05, 0.1, 0.5, 1, 2]) {
  const k = rp * RE / RSUN, aR = a * AU / RSUN, P = period(a, 1);
  const prob = (1 + k) / aR, lim = 90 - Math.acos(prob) * 180 / Math.PI;
  console.log(`${pn.padEnd(8)} a=${a} AU a/R★=${f(aR)} P=${f(P)} d  chance ${f(prob * 100)} %  within ${f(lim)}°  T14 ${f(T14(P, k, aR) * 24)} h`);
}
{ const k = 11.21 * RE / RSUN, aR = 0.05 * AU / RSUN, P = period(0.05, 1);
  for (const inc of [90, 88, 86, 85, 84.5, 84]) { const b = aR * Math.cos(inc * Math.PI / 180); console.log(`Jupiter 0.05 AU i=${inc}: b=${f(b)} R★, T14 ${f(T14(P, k, aR, inc) * 24)} h ${b > 1 + k ? "(no transit)" : b > 1 - k ? "(grazing)" : ""}`); } }
console.log("binomial: 100 systems at 10 % → mean 10, sd", f(Math.sqrt(100 * 0.1 * 0.9)));

console.log("\n## Light Curve: S/N = depth / (σ/√n), n = points in dip (10-min cadence) × transits");
for (const [label, rp, a, rs, ms] of [["Jupiter 0.05 AU Sun", 11.2, 0.05, 1, 1], ["Neptune 0.1 AU Sun", 3.9, 0.1, 1, 1], ["Earth 1 AU Sun", 1, 1, 1, 1], ["Earth 0.05 AU red dwarf", 1, 0.05, 0.2, 0.2]]) {
  const k = rp * RE / (rs * RSUN), aR = a * AU / (rs * RSUN), P = period(a, ms), dur = T14(P, k, aR), pts = dur * 24 * 6, depth = k * k * 1e6;
  const row = [100, 300, 1000].map((s) => { const one = depth / (s / Math.sqrt(pts)); return `σ=${s}: S/N(1)=${f(one, 2)} transits for 7: ${Math.ceil((7 / one) ** 2)}`; });
  console.log(`${label}: depth ${f(depth)} ppm P ${f(P)} d dur ${f(dur * 24)} h pts ${f(pts)} | ${row.join(" | ")}`);
}
console.log("radius from depth: 1.1 % Sun →", f(Math.sqrt(0.011) * RSUN / RE), "R⊕; 0.25 % →", f(Math.sqrt(0.0025) * RSUN / RE));
console.log("Kepler III: P=4.08 d M=1 → a =", f(Math.cbrt((4.08 / 365.25) ** 2)), "AU; P=365 d → 1 AU; P=10 d red dwarf 0.2 →", f(Math.cbrt(0.2 * (10 / 365.25) ** 2)));

console.log("\n## Planet Hunt / Rock or Gas? (archive.json)");
const arch = JSON.parse(readFileSync(new URL("../../TransitHunter/src/common/model/data/archive.json", import.meta.url))).planets;
const massFromK = (K, Pd, ms, inc) => { let m = 0; for (let i = 0; i < 80; i++) m = K * (Pd * DAY / (2 * Math.PI * G)) ** (1 / 3) * (ms * MSUN + m) ** (2 / 3) / Math.sin(inc * Math.PI / 180); return m; };
for (const p of arch) {
  const rFromDepth = p.starRadiusSun * RSUN / RE * Math.sqrt(p.depthPercent / 100);
  const m = p.rvAmplitude ? massFromK(p.rvAmplitude, p.periodDays, p.starMassSun, p.inclinationDeg) / ME : p.massEarth;
  const msini = p.rvAmplitude ? massFromK(p.rvAmplitude, p.periodDays, p.starMassSun, 90) / ME : NaN;
  const rho = 5.514 * m / p.radiusEarth ** 3;
  const rock = 1.07 * m ** (1 / 3.7);
  const cls = p.radiusEarth <= 1.1 * rock ? "rocky" : p.radiusEarth > 6 ? "giant" : "in between";
  console.log(`${p.name.padEnd(13)} P ${f(p.periodDays, 5)} d  depth ${f(p.depthPercent)} %  R★ ${p.starRadiusSun}  R(depth) ${f(rFromDepth)}  R ${f(p.radiusEarth)} R⊕ = ${f(p.radiusEarth * RE / RJ)} RJ  i ${p.inclinationDeg}  K ${p.rvAmplitude}  Msini ${f(msini)}  M ${f(m)} M⊕ = ${f(m * ME / MJ)} MJ  ρ ${f(rho)}  ${cls}  T14 ${f(p.durationHours)} h  year ${p.discoveryYear}`);
}
