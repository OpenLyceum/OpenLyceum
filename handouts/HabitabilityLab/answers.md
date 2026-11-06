# Habitability Lab: Answer Key and Instructor Notes

For the handout *Habitability Lab: What Makes a Planet Habitable?* Instructor use only.

The numbers come from the simulation's formulas and data (`HabitabilityLab/doc/model.md`;
real planets from the NASA Exoplanet Archive snapshot of 2026-11-06), recomputed with
`handouts/tools/answers-habitabilitylab.mjs`. I checked these in the simulation:

- the Earth readouts on Energy Balance and Greenhouse (255 K, 288 K, 238 W/m²);
- TRAPPIST-1 e on Zone Edges;
- the Earth/N₂ readouts on Escape;
- every Aging Star preset, stepped through with the age cursor.

## Suggested pacing (about 2 hours)

| Part | Time | If short on time |
|---|---|---|
| 0 Predictions | 5 min | Assign as pre-lab |
| 1 Energy Balance | 20 min | Skip Q7–Q8 |
| 2 Greenhouse | 20 min | Skip Q13 |
| 3 Zone Edges | 20 min | Skip Q18 |
| 4 Aging Star | 20 min | Keep Q20, Q21, Q23 |
| 5 Escape | 20 min | Skip Q27 |
| 6 Scorecard | 10 min | Assign one planet per group and compare |
| 7 Putting it together | 5 min | |

## Part 0: Predictions

- P1: the right amount of starlight (distance and star), an atmosphere with enough pressure and greenhouse warming, and water itself. Also strong enough gravity to keep the air, and a stable star.
- P2: colder: about 255 K (−18 °C), as Part 1 shows. Many students think "no atmosphere = no protection = hotter".
- P3: closer (about 0.1 AU for a star 100 times dimmer).
- P4: no. Earth leaves the conservative zone in about 1 billion years (Q21).

## Part 1: Energy Balance

**Q1.** (a) Absorbed stays the same; emitted grows as the planet warms until the two bars are equal. (b) When the energy out equals the energy in ("Balanced"). (c) Roughly 10–15 years. The relaxation time is about 3.4 years: the simulation's heat capacity is that of a 100 m ocean layer, which takes years to warm.

**Q2.** Starlight 1361 W/m², absorbed 238 W/m². (a) 1361 × 0.7 ÷ 4 = 238. (b) The planet intercepts starlight on its disk (πR²) but radiates from its whole surface (4πR²). Averaged over the sphere, it gets a quarter of the starlight hitting its disk.

**Q3.**

| Planet | d (AU) | Albedo | S (S⊕) | T_eq (K) | Measured (K) | Difference (K) |
|---|---|---|---|---|---|---|
| Mercury | 0.387 | 0.088 | 6.68 | 437 | 440 | +3 |
| Venus | 0.723 | 0.76 | 1.91 | 229 | 737 | +508 |
| Earth | 1 | 0.30 | 1.00 | 255 | 288 | +33 |
| Mars | 1.524 | 0.25 | 0.431 | 210 | 210 | 0 |

**Q4.** It works for Mercury (no atmosphere) and Mars (thin atmosphere), and fails for Venus and Earth, which have thick atmospheres with greenhouse gases. Venus is colder than Earth in this model because its clouds reflect 76 % of the sunlight.

**Q5.** Albedo 0: 278 K · 0.3: 255 K · 0.7: 206 K · 0.9: 157 K. (a) More ice reflects more sunlight, so the planet cools, so more ice forms: a positive feedback (it amplifies the change). Taken far enough, it leads to a "snowball Earth", which geology suggests happened about 700 million years ago.

**Q6.** 0.5 AU: 360 K · 1 AU: 255 K · 2 AU: 180 K · 4 AU: 127 K. (a) About 0.71 (= 1/√2): T ∝ 1/√d. (b) The same starlight spreads over a sphere of area 4πd², so doubling the distance gives a quarter of the starlight, and T ∝ S^¼.

**Q7.** About 0.1 AU. A star 100 times dimmer needs a planet 10 times closer (d ∝ √L).

**Q8.** (a) About 520 K. The absorbed energy is spread over half the surface instead of all of it, so the day side must be hotter to radiate it away. (Mercury's real day side reaches 700 K: its sunlit point is even hotter than the day-side average.) (b) Slowly rotating planets and tidally locked planets with no thick atmosphere, such as many planets of red dwarfs (Q24).

## Part 2: Greenhouse

**Q9.** Bare rock 255 K, surface 288 K, warming 33 K. (a) The ground emits 390 W/m², but only 238 W/m² leaves the top. The atmosphere absorbs the ground's infrared and sends 152 W/m² back down, so the ground receives sunlight plus this back-radiation. (b) P2: colder without an atmosphere.

**Q10.**

| τ | none | 0.5 | 0.85 | 2 | 10 |
|---|---|---|---|---|---|
| Surface (K) | 255 | 276 | 288 | 320 | 435 |
| Verdict | frozen | liquid | liquid | liquid | boils away (vapor) |

A much stronger greenhouse would boil the oceans: the start of a runaway greenhouse, as Venus may have had.

**Q11.** τ ≈ 140, pressure 92 bar, surface 737 K. (a) Venus absorbs less sunlight than Mercury (high albedo), but its huge greenhouse traps the heat: +508 K. (b) In the vapor region: at 92 bar water boils at about 578 K, and Venus is far hotter (below the critical pressure of 220 bar, so vapor rather than supercritical).

**Q12.** 0.006 bar. (a) Almost exactly at the triple point (611 Pa ≈ 0.006 bar). (b) No. Below the triple-point pressure, warming takes ice straight to vapor (sublimation). There is no liquid phase at that pressure.

**Q13.** 1 bar: liquid · 0.1 bar: liquid · 0.01 bar: vapor · 0.001 bar: vapor. The transition is at about 0.017 bar, the vapor pressure of water at 288 K. Lower air pressure lets molecules leave the liquid more easily, so water boils at a lower temperature (it boils at about 70 °C on top of Everest).

**Q14.** (a) About 236 K: frozen. (b) τ ≈ 3.8. (c) Early Mars must have had a stronger greenhouse than CO₂ alone gives, for example extra hydrogen or methane, or episodes of warming after volcanism or impacts. This "early Mars climate problem" is still an open question.

## Part 3: Zone Edges

**Q15.** Conservative 0.95–1.68 AU; optimistic 0.75–1.77 AU. (a) Venus (0.72 AU) is too hot, just inside the "recent Venus" edge; Earth and Mars are in the conservative zone. (b) The zone assumes a planet with enough atmosphere (pressure and CO₂ greenhouse). Mars has 0.006 bar and almost no greenhouse warming (Part 2), so its water is frozen or vapor. The zone says where liquid water is *possible*.

(c) Inner edge: so much water vapor enters the air that the planet cannot radiate the extra heat. The oceans boil away and the water is broken apart and lost to space. Outer edge: adding CO₂ eventually scatters more sunlight than it traps, so no amount of CO₂ keeps the surface above freezing.

**Q16.** The readout also names the star's spectral type: M dwarfs below about 3900 K, K dwarfs to about 5300 K, G2 V for the Sun, and F stars near 7000 K.

| T★ | L (L☉) | Conservative zone |
|---|---|---|
| 3000 K | 0.003 | 0.055–0.11 AU |
| 4000 K | 0.09 | 0.30–0.57 AU |
| 5000 K | 0.33 | 0.57–1.0 AU |
| 5772 K | 1 | 0.95–1.68 AU |
| 7000 K | 5.2 | 2.0–3.5 AU |

(a) The zone moves outward and gets wider as the star gets hotter and brighter. P3: closer for red dwarfs. (b) Cool stars emit more of their light in the infrared, which water vapor and CO₂ absorb well (and the air scatters less). A planet around a red dwarf warms more for the same total starlight, so both edges sit at lower starlight.

**Q17.**

| Planet | S (S⊕) | Status |
|---|---|---|
| b | 4.15 | too hot |
| c | 2.21 | too hot |
| d | 1.12 | optimistic (inner) |
| e | 0.646 | conservative |
| f | 0.373 | conservative |
| g | 0.252 | conservative |
| h | 0.144 | too cold |

Three in the conservative zone (e, f, g). The whole system fits within 0.062 AU, about one sixth of Mercury's orbit.

**Q18.** TOI-700 d (S = 0.85) is in the conservative zone for 1 and 5 M⊕, but only in the optimistic zone for 0.1 M⊕: the runaway-greenhouse edge moves inward for heavier planets. Stronger surface gravity holds a thinner column of water vapor for the same surface pressure, so the planet can still radiate heat at higher starlight.

**Q19.**

| Planet | T★ | S | Radius | Status |
|---|---|---|---|---|
| Proxima Cen b | 2900 K | 0.64 | ≈1.0 R⊕ (estimated; it does not transit) | conservative |
| Kepler-452 b | 5757 K | 1.10 | 1.63 R⊕ | conservative (optimistic only for 0.1 M⊕) |
| K2-18 b | 3457 K | 1.00 | 2.37 R⊕ | optimistic (inner) |

K2-18 b is above the radius valley (about 1.8–2 R⊕). It is probably a sub-Neptune with a thick hydrogen envelope, or a water-rich world, not a rocky Earth-like planet. JWST detected methane and CO₂ in its atmosphere (2023).

## Part 4: Aging Star

All ages below were read from the simulation's age cursor.

**Q20.** (a) 0.74 L☉, about 236 K. (b) A stronger early greenhouse (more CO₂, possibly methane) kept the oceans liquid: the "faint young Sun paradox".

**Q21.** Leaves the conservative zone at 5.56 Gyr (optimistic only); becomes too hot at 9.42 Gyr; the Sun leaves the main sequence at about 10.7 Gyr (subgiant). Earth has about 1 billion years left (5.56 − 4.6). P4: no.

**Q22.** (a) Venus became too hot at 3.54 Gyr, about 1.1 billion years ago. This is consistent with the idea that Venus may have kept water until about 1 Gyr ago. (b) Mars entered the conservative zone at 1.83 Gyr. At 0.8 Gyr (3.8 billion years ago) it was only in the optimistic outer zone with a dimmer Sun, so its river valleys need a strong greenhouse. Mars then stays in the conservative zone until about 10.7 Gyr.

**Q23.**

| Preset | Leaves conservative zone | End of main sequence |
|---|---|---|
| Red dwarf, 0.16 AU | 364 Gyr | about 401 Gyr |
| Sun and Earth | 5.56 Gyr | about 10.7 Gyr |
| A star, 5 AU | 1.13 Gyr | about 1.14 Gyr |

(a) 2 M☉ stars live about 1 billion years, so many generations have already died. 0.3 M☉ red dwarfs live about 400 billion years, much longer than the universe's age, so none has ever died. (b) Sun-like and smaller stars (K and M dwarfs) live long enough. A stars do not.

**Q24.** (a) Yes. At 10 Gyr the lock distance is about 0.48 AU, outside the planet's 0.16 AU orbit. (b) About 13.7 Myr = 0.0137 Gyr, shown in the locking-status readout. This event lies too close to the start to read precisely on a roughly 400 Gyr timeline. The model is uncertain by at least a factor of 10. (c) Locking time grows as distance⁶ and falls as stellar mass²: for the same star, five times closer means 15,625 times faster. TRAPPIST-1 e's host is lighter too; with the documented Earth-like parameters its estimate is roughly 6,000 years. (d) One side is in permanent daylight and the other in permanent night: a hot day side and a very cold night side, where water could freeze out. A thick atmosphere or ocean currents can carry heat around and even the temperatures out.

## Part 5: Escape

**Q25.** Earth, upper atmosphere at 1000 K, escape speed 11.2 km/s:

| Gas | H₂ | He | H₂O | N₂ | O₂ | CO₂ |
|---|---|---|---|---|---|---|
| v_rms (km/s) | 3.5 | 2.5 | 1.2 | 0.94 | 0.88 | 0.75 |
| Ratio | 3.2 | 4.5 | 9.5 | 11.9 | 12.7 | 14.9 |
| Kept? | lost | lost | kept | kept | kept | kept |

(a) Kept if the escape speed is more than 6 times the typical speed (v_esc > 6 v_rms; Jeans parameter λ > 54). (b) H₂ and He are so light that their fast tail reaches escape speed. Over billions of years they leaked away.

**Q26.** (a) Only CO₂, and only barely (ratio 6.3). (b) 2.38 km/s. Its low gravity lets the fast tail of almost every gas escape, and the Moon has no strong source to replace them. (Its exosphere is extremely thin.)

**Q27.** (a) N₂, O₂ and CO₂. H₂O has a ratio of 5.8, just below 6, but at 150 K water is frozen anyway. (b) Titan is very cold (about 150 K in its upper atmosphere, against 250 K for the Moon), so its molecules move more slowly and stay below its escape speed.

**Q28.** Other ways to lose air: the solar wind stripping the upper atmosphere (Mars lost its global magnetic field early); photochemical escape (sunlight breaks molecules into fast fragments); sputtering; and large impacts blasting air away. NASA's MAVEN mission measured this ongoing loss.

**Q29.** (a) Escape speed (gravity) and the starlight received (which heats and drives escape). (b) Mars, almost exactly on the line. (c) They lie on the "atmospheres" side of the line, yet have no thick atmosphere. Red dwarfs give off much more X-ray and ultraviolet light relative to their total light, and flare for billions of years, so escape is stronger. The line is probably higher, in the "worse" direction, for their planets. (d) Just on the atmosphere side, close to the line: whether it has kept an atmosphere is an open question that JWST is testing.

## Part 6: Scorecard

**Q30.** Sample answer for TRAPPIST-1 e:

| Question | Evidence | |
|---|---|---|
| Starlight | 0.65 S⊕, conservative zone | ✓ |
| Rocky? | 0.92 R⊕, 0.69 M⊕ (measured by transit timing), density ≈ 4.9 g/cm³ | ✓ |
| Star's lifetime | 0.09 M☉ star: lives far longer than the universe's age (closest track: red dwarf) | ✓ |
| Tidally locked | roughly 6,000 years in the Earth-like estimate | ✗ or ? |
| Atmosphere | near the shoreline; red-dwarf flares and X-rays (TRAPPIST-1 b and c are bare) | ? |
| Greenhouse needed | bare-rock T ≈ 229 K at albedo 0.3, so it needs some greenhouse warming | ? |

Verdict: one of the most promising known candidates. The key next measurement is whether it has an atmosphere, for example with JWST transmission or thermal-emission spectra.

Other planets:

- **Proxima Cen b:** conservative; mass ≥ 1.07 M⊕ but no radius (it does not transit), so we cannot tell whether it is rocky; very active flaring star; locked within roughly 64,000 years in the Earth-like estimate.
- **LHS 1140 b:** conservative (S ≈ 0.43); 1.73 R⊕ and 5.6 M⊕, so density ≈ 6 g/cm³, rocky or water-rich; a prime JWST target.
- **Kepler-442 b:** K star (4400 K); 1.34 R⊕ (mass estimated); conservative; stays habitable for tens of Gyr; the Earth-like locking estimate is about 0.95 Gyr; but 370 pc away, too far for atmosphere studies.
- **Kepler-452 b:** Sun-like star; 1.63 R⊕ (near the radius valley, may not be rocky); the star is about 6 Gyr old, so near the 6.45 Gyr exit from the conservative zone in the 1 M☉ track.

## Part 7: Putting it together

**Q31.** See Part 0.

**Q32.** Any two:

- Mars is in the zone but has no liquid water (too little pressure and greenhouse).
- K2-18 b is in the zone but is probably not rocky.
- TRAPPIST-1 b and c may have lost their atmospheres.
- Early Mars was in the optimistic zone but needed a stronger greenhouse than CO₂.
- Earth itself will leave the zone as the Sun brightens.

**Q33.**

- Red dwarfs: many nearby; deep transits and large wobbles; zones last hundreds of Gyr. But planets are tidally locked, and flares and X-rays may strip atmospheres.
- Sun-like stars: known to work (Earth), not locked, gentle radiation. But the signals are tiny and their zones last only about 5 Gyr.
- A stars: short lives (about 1 Gyr) and intense ultraviolet light.

## Common misconceptions

- "No atmosphere = hotter." It is colder: greenhouse gases warm (Q9).
- "Habitable zone = habitable / has life." The zone says only that liquid water is possible with a suitable atmosphere (Q15, Q32).
- "Farther from a dim star is fine." Dim stars need closer planets (Q7, Q16).
- "Liquid water only needs the right temperature." It also needs pressure above the triple point (Q12–Q13).
- "Heavy gases escape too, just more slowly." For large escape speeds the escaping share is vanishingly small (about 10⁻⁹¹ for N₂ on Earth).
- "The habitable zone is fixed." It moves outward as stars brighten (Q21).

## Note on spelling

The simulation's English labels were changed to American spelling on 2026-11-06 (pushed to `main`
and deployed), so the labels quoted in the handout match the live site.

The "What's going on?" button is this simulation's equivalent of the other sims' "How does it work?".

## Corrections to the archive-derived evidence

Kepler-62 e/f have mass upper limits of ≤36/≤35 M⊕, not measured masses. Their cards now say
"upper limit," and they are excluded from the measured-mass cosmic-shoreline cloud. A bound
cannot establish the planet's actual density or escape speed. The cloud now contains 611 planets.
The tidal-lock answers above use the full Gladman despinning relation with the documented
12-hour initial spin, Q=100, and rigidity; they are order-of-magnitude Earth-like estimates.
