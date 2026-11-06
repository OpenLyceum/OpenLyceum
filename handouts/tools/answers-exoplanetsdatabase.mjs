// Answer-key numbers for the Exoplanets Database handout, computed from the snapshot bundled in the
// sim (ExoplanetsDatabase/src/common/model/data/pscomppars.json), with the sim's own groupings.
import { readFileSync } from "node:fs";
const snap = JSON.parse(readFileSync(new URL("../../ExoplanetsDatabase/src/common/model/data/pscomppars.json", import.meta.url)));
const C = snap.columns, N = snap.planetCount, cats = snap.categories;
const bit = (col) => snap.calculableColumns.indexOf(col);
const calc = (i, col) => bit(col) >= 0 && (C.calculated[i] & (1 << bit(col))) !== 0;
const v = (col, i) => (C[col][i] === null || C[col][i] === undefined ? NaN : C[col][i]);
const method = (i) => cats.discoverymethod[C.discoverymethod[i]];
const facility = (i) => cats.disc_facility[C.disc_facility[i]];
const prov = (i) => cats.pl_bmassprov[C.pl_bmassprov[i]];
const group = (m) => ({ Transit: "Transit", "Radial Velocity": "Radial velocity", Microlensing: "Microlensing", Imaging: "Imaging" })[m] ?? "Other";
const idx = [...Array(N).keys()];
const pct = (a, b) => `${a} (${((100 * a) / b).toFixed(1)} %)`;
const f = (x, n = 3) => Number(Number(x).toPrecision(n));
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };

console.log("snapshot", snap.retrieved, "confirmed", N, "TESS cand", snap.tessCandidates, "Kepler cand", snap.keplerCandidates);
console.log("found by TESS", idx.filter((i) => facility(i) === "Transiting Exoplanet Survey Satellite (TESS)").length, " by Kepler", idx.filter((i) => facility(i) === "Kepler").length, " by K2", idx.filter((i) => facility(i) === "K2").length);
for (const since of [1989, 2016, 2020, 2024]) {
  const sel = idx.filter((i) => v("disc_year", i) >= since);
  const counts = {};
  for (const i of sel) counts[group(method(i))] = (counts[group(method(i))] ?? 0) + 1;
  console.log(`since ${since}: n=${sel.length}`, Object.entries(counts).map(([k, n]) => `${k} ${pct(n, sel.length)}`).join(", "));
}
const before = idx.filter((i) => v("disc_year", i) + (v("disc_month", i) - 0.5) / 12 <= 2019.5).length;
console.log("discovered by mid-2019:", before, "growth factor vs 4000:", f(N / 4000));

const limit = (i, col) => C[`${col}lim`]?.[i] ?? 0;
const measured = (i) => Number.isFinite(v("pl_bmasse", i)) && !calc(i, "pl_bmasse") && limit(i, "pl_bmasse") === 0;
console.log("mass limits:", idx.filter(i => limit(i, "pl_bmasse") === 1).length, "upper;", idx.filter(i => limit(i, "pl_bmasse") === -1).length, "lower; estimated:", idx.filter(i => calc(i, "pl_bmasse")).length);
console.log("\nmasses listed", idx.filter((i) => Number.isFinite(v("pl_bmasse", i))).length, " measured", idx.filter(measured).length, " Msini", idx.filter((i) => measured(i) && prov(i) === "Msini").length, " radius listed", idx.filter((i) => Number.isFinite(v("pl_rade", i))).length, " radius measured", idx.filter((i) => Number.isFinite(v("pl_rade", i)) && !calc(i, "pl_rade") && limit(i, "pl_rade") === 0).length);

// Hot Jupiters: mass ≥ 95 M⊕ (0.3 MJ), period ≤ 10 d
const hj = (onlyMeasured) => idx.filter((i) => v("pl_bmasse", i) >= 95 && v("pl_orbper", i) <= 10 && (!onlyMeasured || measured(i)));
console.log("\nhot Jupiters (M≥95, P≤10):", hj(false).length, "measured only:", hj(true).length, "share of all:", f((100 * hj(false).length) / N), "%");
const hjm = {}; for (const i of hj(false)) hjm[group(method(i))] = (hjm[group(method(i))] ?? 0) + 1; console.log("  by method", hjm);
const sunlike = idx.filter((i) => v("st_mass", i) >= 0.95 && v("st_mass", i) <= 1.05);
console.log("  around Sun-like stars (0.95–1.05):", sunlike.filter((i) => hj(false).includes(i)).length, "of", sunlike.length);
// Cold giants
const coldGiants = idx.filter((i) => measured(i) && v("pl_bmasse", i) >= 95 && v("pl_orbsmax", i) >= 1);
console.log("measured giants ≥95 M⊕ at ≥1 au:", coldGiants.length);

// Radius valley: transit planets with measured radius, bins
console.log("\nradius bins (Transit, measured radius, P ≤ 100 d):");
const tr = idx.filter((i) => method(i) === "Transit" && Number.isFinite(v("pl_rade", i)) && !calc(i, "pl_rade") && v("pl_orbper", i) <= 100);
for (const [lo, hi] of [[1, 1.25], [1.25, 1.5], [1.5, 1.75], [1.75, 2], [2, 2.25], [2.25, 2.5], [2.5, 2.75], [2.75, 3], [3, 3.5]]) console.log(`  ${lo}–${hi}: ${tr.filter((i) => v("pl_rade", i) >= lo && v("pl_rade", i) <= hi).length}`);
for (const [lo, hi] of [[1, 1.4], [1.4, 1.8], [1.8, 2.2], [2.2, 2.6], [2.6, 3.0]]) console.log(`  0.4-wide ${lo}–${hi}: all-transit ${idx.filter((i) => method(i) === "Transit" && v("pl_rade", i) >= lo && v("pl_rade", i) <= hi).length}  measured ${tr.filter((i) => v("pl_rade", i) >= lo && v("pl_rade", i) <= hi).length}`);
// hot-Neptune desert: 2–6 R⊕ (Neptunes 3–6) with P < 3 d vs 10–30 d
const nep = (plo, phi) => idx.filter((i) => v("pl_rade", i) >= 3 && v("pl_rade", i) <= 6 && !calc(i, "pl_rade") && v("pl_orbper", i) >= plo && v("pl_orbper", i) <= phi).length;
console.log("Neptunes 3–6 R⊕ with P 1–3 d:", nep(1, 3), " P 10–30 d:", nep(10, 30));

// Kepler's third law agreement
const kep = idx.filter((i) => [v("pl_orbper", i), v("pl_orbsmax", i), v("st_mass", i)].every(Number.isFinite));
const diff = (i) => { const P = v("pl_orbper", i) / 365.25; const a = v("pl_orbsmax", i); const m = v("st_mass", i); return Math.abs(P * P - a ** 3 / m) / Math.max(P * P, a ** 3 / m); };
console.log("\nKepler: with P, a, M★:", kep.length, " within 10 %:", f((100 * kep.filter((i) => diff(i) <= 0.1).length) / kep.length), "%");
const show = (name) => { const i = C.pl_name.indexOf(name); if (i < 0) return console.log(name, "not found");
  const P = v("pl_orbper", i), a = v("pl_orbsmax", i), m = v("st_mass", i);
  console.log(`${name}: P ${P} d, a ${a} au, M★ ${m}, e ${v("pl_orbeccen", i)}, R ${v("pl_rade", i)}, M ${v("pl_bmasse", i)} (${prov(i)}${calc(i, "pl_bmasse") ? ", calc" : ""}), Teff ${v("st_teff", i)}, R★ ${v("st_rad", i)}, d ${v("sy_dist", i)} pc, ${method(i)} ${v("disc_year", i)} → M★ from Kepler ${f(a ** 3 / (P / 365.25) ** 2)}  (${f(100 * diff(i), 2)} % apart)`); };
for (const n of ["TRAPPIST-1 e", "Proxima Cen b", "51 Peg b", "HD 189733 b", "Kepler-47 c", "Kepler-16 b", "nu Oph b", "HD 209458 b", "Kepler-452 b", "beta Pic b", "HR 8799 e", "OGLE-2005-BLG-390L b", "K2-18 b", "TOI-700 d", "Kepler-10 b", "GJ 1214 b", "55 Cnc e", "Kepler-22 b"]) show(n);
console.log("massive hosts (M★ ≥ 2.5, P and a measured):");
idx.filter((i) => v("st_mass", i) >= 2.5 && Number.isFinite(v("pl_orbper", i)) && Number.isFinite(v("pl_orbsmax", i))).slice(0, 12).forEach((i) => show(C.pl_name[i]));
console.log("largest disagreements (top 8):");
kep.sort((a, b) => diff(b) - diff(a)).slice(0, 8).forEach((i) => show(C.pl_name[i]));

// Eccentricity vs period
const ecc = (lo, hi) => idx.filter((i) => limit(i, "pl_orbeccen") === 0 && limit(i, "pl_orbper") === 0 && Number.isFinite(v("pl_orbeccen", i)) && v("pl_orbper", i) >= lo && v("pl_orbper", i) < hi).map((i) => v("pl_orbeccen", i));
for (const [lo, hi] of [[0, 5], [5, 20], [20, 100], [100, 1000], [1000, 1e6]]) { const e = ecc(lo, hi); console.log(`ecc P ${lo}–${hi} d: n ${e.length} median ${f(median(e), 2)} share>0.3 ${f((100 * e.filter((x) => x > 0.3).length) / e.length, 2)} %`); }

// Distance by method and by facility
for (const m of ["Transit", "Radial velocity", "Microlensing", "Imaging"]) console.log(`distance median ${m}: ${f(median(idx.filter((i) => group(method(i)) === m && Number.isFinite(v("sy_dist", i))).map((i) => v("sy_dist", i))))} pc`);
for (const fac of ["Kepler", "Transiting Exoplanet Survey Satellite (TESS)", "K2"]) console.log(`distance median ${fac}: ${f(median(idx.filter((i) => facility(i) === fac && Number.isFinite(v("sy_dist", i))).map((i) => v("sy_dist", i))))} pc`);
// Earth-like region
const earthish = idx.filter((i) => v("pl_rade", i) <= 1.5 && v("pl_orbsmax", i) >= 0.7 && v("pl_orbsmax", i) <= 1.5);
console.log("\nplanets ≤1.5 R⊕ at 0.7–1.5 au:", earthish.length, earthish.map((i) => C.pl_name[i]).join(", "));
const earthMass = idx.filter((i) => measured(i) && v("pl_bmasse", i) <= 2 && v("pl_orbsmax", i) >= 0.5 && v("pl_orbsmax", i) <= 2);
console.log("measured mass ≤2 M⊕ at 0.5–2 au:", earthMass.length, earthMass.map((i) => `${C.pl_name[i]} (${method(i)})`).join(", "));
// Solar-system analogs detectability: Jupiter-mass at 5 au
const jup = idx.filter((i) => measured(i) && v("pl_bmasse", i) >= 100 && v("pl_bmasse", i) <= 1000 && v("pl_orbsmax", i) >= 3 && v("pl_orbsmax", i) <= 7);
const jm = {}; for (const i of jup) jm[group(method(i))] = (jm[group(method(i))] ?? 0) + 1; console.log("Jupiter analogs (100–1000 M⊕, 3–7 au):", jup.length, jm);
// multiplicity
console.log("systems with ≥5 planets (planets):", idx.filter((i) => v("sy_pnum", i) >= 5).length);

// Counts exactly as the Explore filters make them (inclusive bounds; estimated ≈ values included).
console.log("\n## As Explore counts them (estimated values included, bounds inclusive)");
const inR = (i, col, lo, hi) => v(col, i) >= lo && v(col, i) <= hi;
for (const [lo, hi] of [[1, 1.4], [1.4, 1.8], [1.8, 2.2], [2.2, 2.6], [2.6, 3]]) console.log(`Transit only, radius ${lo}–${hi}: ${idx.filter((i) => method(i) === "Transit" && inR(i, "pl_rade", lo, hi)).length}`);
console.log("radius 3–6, period 1–3 d:", idx.filter((i) => inR(i, "pl_rade", 3, 6) && inR(i, "pl_orbper", 1, 3)).length, " period 10–30 d:", idx.filter((i) => inR(i, "pl_rade", 3, 6) && inR(i, "pl_orbper", 10, 30)).length);
console.log("radius ≥ 8, period 1–3 d:", idx.filter((i) => v("pl_rade", i) >= 8 && inR(i, "pl_orbper", 1, 3)).length, " period 10–30 d:", idx.filter((i) => v("pl_rade", i) >= 8 && inR(i, "pl_orbper", 10, 30)).length);
const sl = (i) => inR(i, "st_mass", 0.95, 1.05);
console.log("Sun-like:", idx.filter(sl).length, " + mass ≥95 & period ≤10:", idx.filter((i) => sl(i) && v("pl_bmasse", i) >= 95 && v("pl_orbper", i) <= 10).length, " + measured only:", idx.filter((i) => sl(i) && measured(i) && v("pl_bmasse", i) >= 95 && v("pl_orbper", i) <= 10).length);
console.log("Sun-like, RV only:", idx.filter((i) => sl(i) && method(i) === "Radial Velocity").length, " RV hot Jupiters:", idx.filter((i) => sl(i) && method(i) === "Radial Velocity" && v("pl_bmasse", i) >= 95 && v("pl_orbper", i) <= 10).length);
console.log("mass listed:", idx.filter((i) => Number.isFinite(v("pl_bmasse", i))).length, " measured only:", idx.filter(measured).length);

console.log("\n## Explore lists used by the handout");
const kp = (i) => { const P = v("pl_orbper", i) / 365.25, a = v("pl_orbsmax", i), m = v("st_mass", i); return [P * P, a ** 3 / m, f(100 * Math.abs(P * P - a ** 3 / m) / Math.max(P * P, a ** 3 / m), 2)]; };
const list = (label, sel) => { console.log(`${label}: ${sel.length}`); for (const i of sel) console.log(`   ${C.pl_name[i].padEnd(22)} ${method(i).padEnd(16)} P ${v("pl_orbper", i)} a ${v("pl_orbsmax", i)} M★ ${v("st_mass", i)} M ${v("pl_bmasse", i)}${calc(i, "pl_bmasse") ? "≈" : ""} R ${v("pl_rade", i)}${calc(i, "pl_rade") ? "≈" : ""} e ${v("pl_orbeccen", i)}  Kepler ${kp(i).map((x) => f(x)).join(" / ")} % `); };
list("Earth-like orbits (a 0.72–1.5, M★ 0.9–1.1)", idx.filter((i) => inR(i, "pl_orbsmax", 0.72, 1.5) && inR(i, "st_mass", 0.9, 1.1)));
list("Star mass ≤ 0.1", idx.filter((i) => v("st_mass", i) <= 0.1));
list("Oldest (year ≤ 1996)", idx.filter((i) => v("disc_year", i) <= 1996));
list("Star mass ≥ 2.5 and a ≥ 1.5", idx.filter((i) => v("st_mass", i) >= 2.5 && v("pl_orbsmax", i) >= 1.5).slice(0, 40));
