// Answer-key numbers for the Stellar Wobble handout, from the sim's own formulas
// (StellarWobble/doc/model.md: circular two-body orbits, K = (2πG/P)^(1/3) Mp sin i /(M★+Mp)^(2/3)).
const G = 6.674e-11, C = 299792458, MSUN = 1.989e30, MJ = 1.898e27, ME = 5.972e24, AU = 1.496e11, DAY = 86400;
const period = (ms, mp, a) => 2 * Math.PI * Math.sqrt((a * AU) ** 3 / (G * (ms * MSUN + mp * MJ)));
const starSpeed = (ms, mp, a) => { const P = period(ms, mp, a); const M = ms * MSUN + mp * MJ; return 2 * Math.PI * (a * AU * mp * MJ / M) / P; };
const planetSpeed = (ms, mp, a) => { const P = period(ms, mp, a); const M = ms * MSUN + mp * MJ; return 2 * Math.PI * (a * AU * ms * MSUN / M) / P; };
const minMass = (K, Pd, ms) => { let m = 0; for (let i = 0; i < 60; i++) m = K * (Pd * DAY / (2 * Math.PI * G)) ** (1 / 3) * (ms * MSUN + m) ** (2 / 3); return m; };
const f = (x, n = 3) => Number(x.toPrecision(n));

console.log("## Doppler: Δλ = λ v/c");
for (const v of [100e3, -50e3, 300e3, 30, 10, 1]) console.log(`v=${v} m/s  Hβ ${(486.13 * v / C).toExponential(3)} nm  Hα ${(656.28 * v / C).toExponential(3)} nm`);

console.log("\n## Wobble (star M☉, planet MJ, a AU) → P days, v★ m/s, vp km/s, a★ (km)");
for (const [ms, mp, a, label] of [[1, 1, 1, "default"], [1, 2, 1, "2 MJ"], [1, 4, 1, "4 MJ"], [1, 1, 0.25, "0.25 AU"], [1, 1, 4, "4 AU"], [0.5, 1, 1, "0.5 Msun"], [1.5, 1, 1, "1.5 Msun"], [1, 1, 5, "Jupiter-like 5 AU"], [1, ME / MJ, 1, "Earth"], [1, 1, 0.05, "hot Jupiter 0.05"], [1, 13, 0.05, "13 MJ 0.05"]]) {
  const M = ms * MSUN + mp * MJ;
  console.log(label.padEnd(18), "P", f(period(ms, mp, a) / DAY, 4), "v*", f(starSpeed(ms, mp, a)), "vp", f(planetSpeed(ms, mp, a) / 1e3), "a*", f(a * AU * mp * MJ / M / 1e3), "km  ratio vp/v*", f(planetSpeed(ms, mp, a) / starSpeed(ms, mp, a)));
}
console.log("Sun radius 696,000 km; Jupiter at 5.2 AU: v*", f(starSpeed(1, 1, 5.2)), "a*", f(5.2 * AU * MJ / (MSUN + MJ) / 1e3), "km P", f(period(1, 1, 5.2) / DAY / 365.25), "yr");

console.log("\n## Viewing Angle: 1 MJ, 1 AU, 1 Msun");
for (const i of [90, 75, 60, 45, 30, 15, 5, 0]) { const K = starSpeed(1, 1, 1) * Math.sin(i * Math.PI / 180); console.log(`i=${i}  K ${f(K)} m/s  Msini ${f(minMass(K, period(1, 1, 1) / DAY, 1) / MJ)} MJ`); }
console.log("P(i>30°) random =", f(Math.cos(Math.PI / 6)), " mean sin i =", f(Math.PI / 4));
console.log("true mass if Msini=0.47 MJ and i=10°:", f(0.47 / Math.sin(10 * Math.PI / 180)), "MJ");

console.log("\n## Observatory targets: M sin i from listed P, K, M★");
for (const [n, ms, P, K] of [["51 Peg", 1.11, 4.2308, 55.9], ["HD 189733", 0.79, 2.21858, 205], ["HD 209458", 1.23, 3.52475, 84.7], ["Gliese 436", 0.47, 2.64388, 17.09], ["Proxima", 0.122, 11.18465, 1.226], ["Sun+Jup", 1, 4332.6, 12.5], ["Sun+Earth", 1, 365.25, 0.0895]]) {
  const m = minMass(K, P, ms); console.log(n.padEnd(10), "Msini", f(m / MJ), "MJ =", f(m / ME), "ME", " a =", f(Math.cbrt(ms * (P / 365.25) ** 2), 3), "AU");
}
console.log("51 Peg alias with 1-day sampling: P/(1±P)? f = 1/P ± 1 →", f(1 / (1 / 4.2308 + 1), 4), f(1 / (1 - 1 / 4.2308), 4), "days");
console.log("Proxima: nights for K/(σ/√(N/2)) = 5 with σ=1:", Math.ceil(2 * (5 * 1 / 1.226) ** 2), " σ=3:", Math.ceil(2 * (5 * 3 / 1.226) ** 2), " with jitter σ=√5:", Math.ceil(2 * (5 * Math.sqrt(5) / 1.226) ** 2));
