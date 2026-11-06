// Answer-key numbers for the Habitability Lab handout, from the formulas and data in
// HabitabilityLab/doc/model.md and src/common/model (constants copied from HabitabilityLabConstants.ts).
import { readFileSync } from "node:fs";
const SIGMA = 5.670374419e-8, S0 = 1361, KB = 1.380649e-23, AMU = 1.66053907e-27;
const f = (x, n = 3) => Number(Number(x).toPrecision(n));
const Teq = (S, A, factor = 4) => ((S * S0 * (1 - A)) / (factor * SIGMA)) ** 0.25;
const planets = [["Mercury", 0.387, 0.088, 440, 0], ["Venus", 0.723, 0.76, 737, 92], ["Earth", 1, 0.3, 288, 1.013], ["Mars", 1.524, 0.25, 210, 0.006]];

console.log("## Energy Balance: T_eq = [S(1−A)/(4σ)]^¼");
for (const [n, d, A, Ts] of planets) { const S = 1 / d ** 2; console.log(`${n.padEnd(8)} S ${f(S)} S⊕ = ${f(S * S0)} W/m²  T_eq ${f(Teq(S, A))} K  day side ${f(Teq(S, A, 2))} K  measured ${Ts} K  gap ${f(Ts - Teq(S, A))} K  absorbed ${f(S * S0 * (1 - A) / 4)} W/m²`); }
for (const A of [0, 0.1, 0.3, 0.5, 0.7, 0.9]) console.log(`Earth orbit, albedo ${A}: ${f(Teq(1, A))} K`);
for (const d of [0.5, 0.7, 1, 1.5, 2, 4]) console.log(`albedo 0.3, d ${d} AU: ${f(Teq(1 / d ** 2, 0.3))} K`);
for (const L of [0.01, 0.1, 1, 10]) console.log(`albedo 0.3, d 1 AU, L ${L}: ${f(Teq(L, 0.3))} K  distance for 255 K: ${f(Math.sqrt(L))} AU`);
console.log("relaxation time at 255 K: C/(4σT³) =", f(4e8 / (4 * SIGMA * 255 ** 3) / 3.15576e7), "yr");

console.log("\n## Greenhouse: T_s⁴ = T_eq⁴ (1 + ¾τ)");
const tauFor = (Ts, Te) => (4 / 3) * ((Ts / Te) ** 4 - 1);
for (const [n, d, A, Ts, P] of planets.slice(1)) { const te = Teq(1 / d ** 2, A); console.log(`${n}: T_eq ${f(te)} τ ${f(tauFor(Ts, te))} → ${f(te * (1 + 0.75 * tauFor(Ts, te)) ** 0.25)} K, pressure ${P} bar`); }
{ const te = Teq(0.75 / 1.524 ** 2, 0.25); console.log(`Early Mars: S ${f(0.75 / 1.524 ** 2)} T_eq ${f(te)} τ 1.5 → ${f(te * (1 + 0.75 * 1.5) ** 0.25)} K; τ for 273 K: ${f(tauFor(273.16, te))}`); }
for (const tau of [0, 0.5, 0.85, 2, 5, 10, 50, 140]) console.log(`Earth (T_eq 255) τ ${tau}: ${f(Teq(1, 0.3) * (1 + 0.75 * tau) ** 0.25)} K`);
const boil = (p) => { const Tc = 647.096, pc = 22.064e6, a = [-7.85951783, 1.84408259, -11.7866497, 22.6807411, -15.9618719, 1.80122502];
  let lo = 273.16, hi = 647.09; for (let k = 0; k < 60; k++) { const T = (lo + hi) / 2, th = 1 - T / Tc; const ps = pc * Math.exp((Tc / T) * (a[0] * th + a[1] * th ** 1.5 + a[2] * th ** 3 + a[3] * th ** 3.5 + a[4] * th ** 4 + a[5] * th ** 7.5)); if (ps < p) lo = T; else hi = T; } return (lo + hi) / 2; };
for (const p of [0.01, 0.1, 1.013, 10, 92]) console.log(`boiling point at ${p} bar: ${f(boil(p * 1e5))} K`);

console.log("\n## Zone Edges (Kopparapu 2013/14)");
const K = { recentVenus: [1.776, 2.136e-4, 2.533e-8, -1.332e-11, -3.097e-15], runaway1: [1.107, 1.332e-4, 1.58e-8, -8.308e-12, -1.931e-15], runaway5: [1.188, 1.433e-4, 1.707e-8, -8.968e-12, -2.084e-15], runaway01: [0.99, 1.209e-4, 1.404e-8, -7.418e-12, -1.713e-15], maxGreenhouse: [0.356, 6.171e-5, 1.698e-9, -3.198e-12, -5.575e-16], earlyMars: [0.32, 5.547e-5, 1.526e-9, -2.874e-12, -5.011e-16] };
const Seff = (e, T) => { const t = Math.min(7200, Math.max(2600, T)) - 5780; const c = K[e]; return c[0] + c[1] * t + c[2] * t ** 2 + c[3] * t ** 3 + c[4] * t ** 4; };
const edges = (L, T) => Object.fromEntries(Object.keys(K).map((e) => [e, Math.sqrt(L / Seff(e, T))]));
const sun = edges(1, 5772); console.log("Sun (5772 K):", Object.entries(sun).map(([k, d]) => `${k} ${f(d)} AU`).join(", "));
for (const [T, L, lab] of [[3060, 0.0036, "M5"], [3400, 0.014, "M3"], [3850, 0.07, "M0"], [4440, 0.16, "K5"], [5270, 0.46, "K0"], [6550, 3.2, "F5"], [7200, 6.5, "F0"]]) { const e = edges(L, T); console.log(`${lab} ${T} K L ${L}: conservative ${f(e.runaway1)}–${f(e.maxGreenhouse)} AU, optimistic ${f(e.recentVenus)}–${f(e.earlyMars)} AU; S edges ${f(Seff("runaway1", T))}–${f(Seff("maxGreenhouse", T))}`); }
const status = (S, T, inner = "runaway1") => S >= Seff("recentVenus", T) ? "too hot" : S >= Seff(inner, T) ? "optimistic (inner)" : S >= Seff("maxGreenhouse", T) ? "CONSERVATIVE" : S >= Seff("earlyMars", T) ? "optimistic (outer)" : "too cold";
const pl = JSON.parse(readFileSync(new URL("../../HabitabilityLab/src/common/model/data/planets.json", import.meta.url)));
for (const p of pl.curated) console.log(`${p.name.padEnd(18)} S ${f(p.insolation)} T★ ${p.starTemperature} R ${p.radius} M ${p.massLimit === 1 ? "≤" : p.massLimit === -1 ? "≥" : p.massMeasured ? "" : "≈"}${p.mass}${p.massIsMinimum ? " (min)" : ""} a ${p.semiMajorAxis} → ${status(p.insolation, p.starTemperature)}  [0.1 M⊕: ${status(p.insolation, p.starTemperature, "runaway01")}; 5 M⊕: ${status(p.insolation, p.starTemperature, "runaway5")}]`);
for (const [n, S] of [["Venus", 1.91], ["Earth", 1], ["Mars", 0.431]]) console.log(`${n}: ${status(S, 5772)}`);

console.log("\n## Escape: λ = (v_esc/v_p)², fraction = erfc(√λ) + 2√(λ/π) e^−λ, keep if v_esc > 6 v_rms");
const erfc = (x) => { const t = 1 / (1 + 0.5 * x); return t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); };
const gases = [["H2", 2.016], ["He", 4.003], ["H2O", 18.015], ["N2", 28.014], ["O2", 31.998], ["CO2", 44.01]];
const bodies = [["Moon", 2.38, 250], ["Mercury", 4.25, 700], ["Mars", 5.03, 250], ["Venus", 10.36, 300], ["Earth", 11.19, 1000], ["Titan", 2.64, 150], ["Jupiter", 59.5, 1000]];
for (const [b, ve, T] of bodies) {
  const row = gases.map(([g, m]) => { const vrms = Math.sqrt((3 * KB * T) / (m * AMU)) / 1e3, vp = Math.sqrt((2 * KB * T) / (m * AMU)) / 1e3, lam = (ve / vp) ** 2, fr = erfc(Math.sqrt(lam)) + 2 * Math.sqrt(lam / Math.PI) * Math.exp(-lam);
    return `${g}: vrms ${f(vrms, 2)} ratio ${f(ve / vrms, 2)} λ ${f(lam, 3)} frac ${fr.toExponential(1)} ${ve > 6 * vrms ? "KEPT" : "lost"}`; });
  console.log(`${b} (v_esc ${ve}, T ${T} K):\n   ${row.join("\n   ")}`);
}
console.log("\nshoreline S = (v/6.5)^4:", [["Mercury", 4.25, 6.67], ["Moon", 2.38, 1], ["Mars", 5.03, 0.431], ["Titan", 2.64, 0.011], ["Ganymede", 2.74, 0.037], ["Callisto", 2.44, 0.037], ["Earth", 11.19, 1], ["Venus", 10.36, 1.91]].map(([n, v, S]) => `${n}: line ${f((v / 6.5) ** 4)} vs S ${S} → ${S < (v / 6.5) ** 4 ? "atmosphere side" : "bare side"}`).join("; "));
for (const n of pl.shorelineHighlights ?? []) console.log("highlight", JSON.stringify(n));

console.log("\n## Any main-sequence star (Pecaut & Mamajek table, log L interpolated in T)");
const MS = [[2600, 0.0005, "M8 V"], [3060, 0.0036, "M5 V"], [3400, 0.014, "M3 V"], [3850, 0.07, "M0 V"], [4440, 0.16, "K5 V"], [5270, 0.46, "K0 V"], [5770, 1, "G2 V"], [6550, 3.2, "F5 V"], [7200, 6.5, "F0 V"]];
const lum = (T) => { for (let i = 0; i < MS.length - 1; i++) { const [t0, l0] = MS[i], [t1, l1] = MS[i + 1]; if (T >= t0 && T <= t1) return 10 ** (Math.log10(l0) + ((T - t0) / (t1 - t0)) * (Math.log10(l1) - Math.log10(l0))); } return NaN; };
for (const T of [3000, 4000, 5000, 5772, 7000]) { const L = lum(T), e = edges(L, T); console.log(`${T} K: L ${f(L, 2)} L☉, conservative ${f(e.runaway1, 2)}–${f(e.maxGreenhouse, 2)} AU, optimistic ${f(e.recentVenus, 2)}–${f(e.earlyMars, 2)} AU`); }

console.log("\n## Tidal lock (Gladman et al. 1996 as in model.md)");
const G = 6.674e-11, ME = 5.972e24, RE = 6.371e6, MSUN = 1.989e30;
const rho = ME / ((4 / 3) * Math.PI * RE ** 3), gravity = G * ME / RE ** 2;
const k2 = 1.5 / (1 + 19 * 3e10 / (2 * rho * gravity * RE));
const tlock = (aAU, mStarSun) => (2 * Math.PI / (12 * 3600)) * (aAU * 1.496e11) ** 6 * (0.4 * ME * RE ** 2) * 100 / (3 * G * (mStarSun * MSUN) ** 2 * k2 * RE ** 5 * 3.15576e7);
for (const [n, a, m] of [["TRAPPIST-1 e", 0.02925, 0.0898], ["Proxima b", 0.04848, 0.122], ["0.3 M☉ at 0.1 AU", 0.1, 0.3], ["Red dwarf preset 0.3 M☉ 0.16 AU", 0.16, 0.3], ["Kepler-442 b 0.6 M☉ 0.409 AU", 0.409, 0.6], ["Earth", 1, 1]]) console.log(`${n}: t_lock ≈ ${f(tlock(a, m) / 1e9, 2)} Gyr`);
for (const age of [0.01, 0.014, 1, 5, 10, 20, 100]) console.log(`lock distance for 0.3 M☉ at ${age} Gyr: ${f(0.16 * (age / (tlock(0.16, 0.3) / 1e9)) ** (1 / 6), 2)} AU`);
console.log("water vapor pressure at 288 K ≈", (() => { const Tc = 647.096, pc = 22.064e6, a = [-7.85951783, 1.84408259, -11.7866497, 22.6807411, -15.9618719, 1.80122502], T = 288, th = 1 - T / Tc; return f(pc * Math.exp((Tc / T) * (a[0] * th + a[1] * th ** 1.5 + a[2] * th ** 3 + a[3] * th ** 3.5 + a[4] * th ** 4 + a[5] * th ** 7.5)) / 1e5); })(), "bar");
