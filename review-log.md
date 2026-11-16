# Fleet skill-conformance review

Scored against `Baton/skills/*/SKILL.md`, distilled once on 2026-09-29. Each cell is `follow`, `gap`, or `n/a`. A gap lists at most one path. Generated data under `**/generated/**` and locale JSON are excluded from greps. `npm run lint`, `check`, `test`, and `build` are recorded separately and are not re-read from the code-review skill.

Prior fuzz (`fuzz-results.md`, 2026-08-19) is cited, not re-run. Sims absent from that run: CapacitorLab, FluidPressureAndFlow, MercuryElongations, MotionMatch, MotionSensor, QuantumPotential, RadioactivityAndStatistics.

## Probe sheet

Structural skills are scored on every sim. Feature skills are `n/a` when the applicability grep is empty.

| Skill | Applicability | follow | gap |
|---|---|---|---|
| coding-conventions | always | no `enum` or `namespace` declarations in `src/**/*.ts` | any `enum` or `namespace` declaration |
| testing | always | `tests/setup.ts`, `tests/memory-leak.test.ts`, `execArgv` contains `--expose-gc`, and `forceGC` is called with a WeakRef argument | any of those missing, or a `*.test.ts` under `src/` |
| model | always | no `model/**` import from `view/`, and `TModel` is not imported from `scenerystack/sim` | either import is present |
| constants | always | a `*Constants.ts` file exists under `src/` | none |
| numerics | always | no `Number.prototype.toFixed` call (`x.toFixed(`) and no `Math.random(` | either call |
| screen-view | always | `src/main.ts`, a `*Screen.ts`, and a `*ScreenView.ts` | any missing |
| strings | always | `src/i18n/StringManager.ts` and `strings_en.json`; no `new Text("…")` / `new Text('…')` | missing manager/file, or a hardcoded `Text` |
| i18n | always | `strings_en.json` plus at least one other `strings_*.json` | English only |
| new-sim | always | no `Sim[A-Z]` identifier under `src/**/*.ts` | any leftover template name |
| disposal | always | same bar as testing's `forceGC(ref)` (bare `forceGC()` does not early-exit) | bare `forceGC()` or no memory-leak test |
| preferences | always | `src/preferences/*PreferencesModel.ts` and `*PreferencesNode.ts` | either missing |
| query-parameters | always | `src/preferences/*QueryParameters.ts` calls `QueryStringMachine`; no `location.search` / `URLSearchParams` | missing schema, or hand-parsed query string |
| keyboard-help-dialog | always | a `*KeyboardHelpContent.ts` that is more than the template stub (a help section other than `BasicActionsKeyboardHelpSection`, or `fromHotkeyData`) | file missing, or stub only |
| accessibility | always | a `*ScreenSummaryContent.ts` or an `accessibleName` | neither |
| optionize | always | `optionize` is used under `src/` | no `optionize` call |
| color-profiles | always | a `*Colors.ts` exists, and no `#hex` or `new Color(` outside `*Colors.ts` | missing file, or a color literal in a view |
| layout | always | a view file references `layoutBounds`, `VBox`, or `HBox` | none of those |
| ui-controls | always | an import from `scenerystack/sun` | no sun import |
| model-view-transform | `ModelViewTransform2` | used, and not imported from `model/**` | used inside `model/**` |
| enumeration | `EnumerationValue` or `EnumerationProperty` | either symbol is present | n/a when absent (no separate gap probe) |
| drag-listener | `DragListener` | `KeyboardDragListener` or `RichDragListener` also present | pointer drag with no keyboard drag |
| custom-drawing | `CanvasNode`, kite `Shape`, or `renderer:` | no bare `getContext(` / `HTMLCanvasElement` | a DOM canvas outside scenery |
| animation | `scenerystack/twixt` or `new Animation` | that import/constructor is present | n/a when absent |
| sound | `soundManager` or `supportsSound` | `soundManager` is used and `src/init.ts` sets `supportsSound`, and there is no `new Audio(` / `new AudioContext` | only one of the two flags, or a raw Web Audio API |

`enumeration` and `animation` have no failure mode beyond "feature absent" (`n/a`). Their `follow` means the sim actually uses the skill's API.

Comment-only hits are not gaps: a `new Text("…")` inside a block comment, or a comment that names the template file `SimScreenSummaryContent.ts`. `Math.random(` and a real `x.toFixed(` call still count.

## Remediation — 2026-09-30

The follow-ups named below were applied in each sim. `Addressed` means that named gap was fixed. A few probes still match other files, because the log records one path per skill:

- TrackLab’s OpenCV tracker and the PlateTectonics globe relief still use an `HTMLCanvasElement` so they can read pixels back.
- The Vernier caliper, the Rotating Sky coordinate guide, and the Basic Coordinates globe stay pointer-only: their arrow keys are already owned.

MazeGame, ExtrasolarPlanets, CarnotHeatEngine, and SpecialRelativity had no follow-up.

## Remediation — 2026-10-02

The leftover probe matches from 2026-09-30 were cleared:

- Hardcoded `Text` in SternGerlach, Precession, QubitSketch, ACPhasor, MotionsOfTheSun, OscillationsAndChaos, RotatingSky, BasicCoordinatesAndSeasons, Resonance, and QuantumPotential now reads from `strings_*.json`. This covers words, axis titles, symbols, icon glyphs, and brackets. Unit-bearing ticks use pattern strings. Some `Text` literals still remain on purpose: empty placeholders that are filled later, bare numbers, and numbers with a unit symbol that are rebuilt every frame (QubitSketch's `°` and `%`). The template doc comment `new Text("label")` in each `*Panel.ts` also remains.
- Color literals: FluidPressureAndFlow's sluice gate, hose icon, vacuum sky, and drop zone, and all fixed OpticsLab screen-icon colors, are now `ProfileColorProperty` entries. FluidPressureAndFlow's `fluidColor.ts` density ramp remains a documented exception. Its colors are a continuous function of density, as the header of `FluidPressureAndFlowColors.ts` explains.

## Sims

### ElectricFieldOfDreams — 2026-09-29

Compliance passed. `npm run lint` passed with one Biome info (schema 2.5.14 vs CLI 2.5.12). `npm run check`, `npm test` (13), and `npm run build` passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.ts` uses `Math.random()` for a spawn position |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | documented `rgba` knob stroke in `ExternalFieldControlPanel.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics (`Math.random` in the model).

### LadyBug — 2026-09-30

Compliance passed. `npm run lint` passed with the same Biome schema info (config 2.5.14, CLI 2.5.12). `npm run check`, `npm test` (7), and `npm run build` passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `LadyBugKeyboardHelpContent.ts` documents only basic actions and checkboxes; `LadybugNode.ts`, `SeekBar.ts`, and `RemoteControlPanel.ts` use `RichDragListener` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | documented `rgba` strokes in `RemoteControlPanel.ts` and `SeekBar.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: keyboard-help dialog does not describe the drag controls.

### RadioWaves — 2026-09-30

Compliance passed. `npm run lint` passed with the same Biome schema info (config 2.5.14, CLI 2.5.12). `npm run check`, `npm test` (10), and `npm run build` passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `RadioWavesKeyboardHelpContent.ts` documents sliders and basic actions; `ElectronNode.ts` keyboard-drags the electron with `RichDragListener` and that binding is not in the dialog |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | documented sun/sky gradient stops in `BackgroundSceneNode.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: keyboard-help dialog does not describe electron drag.

### LunarLander — 2026-09-30

Compliance passed. `npm run lint` passed with the same Biome schema info (config 2.5.14, CLI 2.5.12). `npm run check`, `npm test` (10), and `npm run build` passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `LunarLanderKeyboardHelpContent.ts` hand-builds key icons; `LunarLanderScreenView.ts` registers `KeyboardListener.createGlobal` with no shared `HotkeyData` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | follow | |

Addressed 2026-09-30: keyboard shortcuts and the help dialog are not derived from one `HotkeyData`.

### MovingMan — 2026-09-30

Compliance passed. Lint, typecheck, tests (8), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `MovingManSounds.ts` picks a grunt clip with `Math.random()` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | dialog covers sliders only; `MovingManSpriteNode.ts` keyboard-drags the man |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | follow | |
| sound | follow | |

Addressed 2026-09-30: numerics (`Math.random`) and the keyboard-help dialog omits sprite drag.

### MazeGame — 2026-09-30

Compliance passed. Lint, typecheck, tests (14), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | rows come from `MazeGameHotkeyData` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | pad drag is pointer-only so it does not double-bind the arrow keys |
| custom-drawing | follow | brick texture is a scenery `Pattern`; colors come from `MazeGameColors` |
| animation | follow | |
| sound | follow | |

No follow-up.

### HabitableZones — 2026-09-30

Compliance passed. Lint, typecheck, tests (33), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `SHZDiagramNode.ts` uses `new Text("×")` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | blackbody color is computed in `blackbodyColor.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: the destroyed-indicator glyph is a hardcoded `Text`.

### ExtrasolarPlanets — 2026-09-30

Compliance passed. Lint, typecheck, tests (83), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

No follow-up.

### FieldBoundary — 2026-09-30

Compliance passed. Lint, typecheck, tests (51), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `fluxTally.ts` formats with `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics (`toFixed`).

### DopplerEffect — 2026-09-30

Compliance passed. Lint, typecheck, tests (23), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `DopplerEffectKeyboardHelpContent.ts` hand-builds key icons; no shared `HotkeyData` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | trail alpha is derived from the trail color property |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | n/a | |
| animation | n/a | |
| sound | gap | `Sound.ts` uses `Audio` and `AudioContext` directly; no `soundManager` |

Addressed 2026-09-30: keyboard help is not tied to `HotkeyData`, and sound bypasses tambo.

### LightPropagation — 2026-09-30

Compliance passed. Lint, typecheck, tests (72), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | gap | `labQueryParameterMapping.ts` rewrites the permalink with `URLSearchParams` |
| keyboard-help-dialog | gap | rotate-view rows in `WaveKeyboardHelpContent.ts` are hand-built icons, not `fromHotkeyData` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | `threeCompat.ts` is a documented WebGL shim |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: permalink query rewriting, and the rotate-view help rows.

### TheRamp — 2026-09-30

Compliance passed. Lint, typecheck, tests (6), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | gap | `describeDisposalLeaks([])` never disposes a sim object |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `TimePlotNode.ts` uses `new Text("0")` |
| i18n | follow | |
| new-sim | follow | |
| disposal | gap | same empty memory-leak case list |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | dialog covers sliders only; `SurfaceNode.ts` keyboard-drags the surface |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | follow | |

Addressed 2026-09-30: memory-leak suite, the plot label, and surface drag missing from keyboard help.

### CarnotHeatEngine — 2026-09-30

Compliance passed. Lint, typecheck, tests (63), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

No follow-up.

### SolarSystemModels — 2026-09-30

Compliance passed. Lint, typecheck, tests (43), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `ConfigurationsZodiacStrip.ts` keyboard-pans the zodiac band; the dialog does not mention it |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: zodiac keyboard pan is missing from the help dialog.

### MotionMatch — 2026-09-30

Compliance passed. Lint, typecheck, tests (116), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `MotionSensorSource.ts` logs elapsed time with `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | uses `MoveDraggableItemsKeyboardHelpSection` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics (`toFixed` in a sensor log).

### QubitSketch — 2026-09-30

Compliance passed. Lint, typecheck, tests (85), and the production build passed. Prior fuzz: pass (2026-08-19). The memory-leak file also calls `describeDisposalLeaks([])`, but the tests above it dispose the model and `GatePalettePanel` with `forceGC(ref)`.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `MeasurementHistogramNode.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `BlochSpheresNode.ts` uses `new Text("q0")` and `` new Text(`q${q}`) `` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | gap | `CircuitUrlSync.ts` reads the URL with `URLSearchParams` |
| keyboard-help-dialog | gap | dialog does not mention the Bloch-sphere drag in `BlochSpheresNode.ts` |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `displayUtils.ts` sets `NEUTRAL_PHASE_COLOR` with `new Color(120, 120, 120)` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, qubit labels, URL sync, Bloch drag help, and the neutral phase color.

### VariableStarPhotometry — 2026-09-30

Compliance passed. Lint, typecheck, tests (20), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `BlinkComparatorScreenView.ts` hardcodes `✓`, `▲`, `▼`, `⟶`, and `⟵` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | gap | `StarFieldNode.ts` paints an `HTMLCanvasElement` instead of a `CanvasNode` |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: glyph strings, and the star-field canvas.

### RadioactivityAndStatistics — 2026-09-30

Compliance passed. Lint, typecheck, tests (124), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `csvExport.ts` rounds with `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | gap | `RadioactivityAndStatisticsPanel.ts` still exports `SimPanelOptions` |
| disposal | follow | |
| preferences | follow | |
| query-parameters | gap | `transportTrace.ts` reads `window.location.search` |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: CSV rounding, the `SimPanelOptions` alias, and the trace query string.

### StandingWaves — 2026-09-30

Compliance passed. Lint, typecheck, tests (136), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `PhaseControlPanel.ts` formats impedance with `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | gap | `ReferenceMarkerNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, and the reference marker is pointer-only.

### VernierScales — 2026-09-30

Compliance passed. Lint, typecheck, tests (122), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `PracticeKeyboardHelpContent.ts` is hand-built, with no `fromHotkeyData` or standard section |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | gap | `CaliperNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: practice keyboard help, and the caliper drag.

### Precession — 2026-09-30

Compliance passed. Lint, typecheck, tests (115), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `TumbleSceneNode.ts` hardcodes `I₁ > I₂ > I₃  (kg·m²)`, `L`, and `ω` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `Camera3D.ts` constructs `Color` values outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | n/a | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: inertia heading and axis labels, and camera colors.

### SternGerlach — 2026-09-30

Compliance passed. Lint, typecheck, tests (122), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `ExperimentAreaNode.ts` uses `new Text("✕")` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: the close glyph is a hardcoded `Text`.

### InterferometryLab — 2026-09-30

Compliance passed. Lint, typecheck, tests (141), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | `sourceColor.ts` computes spectral sRGB |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | n/a | |
| custom-drawing | gap | `FringePatternNode.ts` samples into an `HTMLCanvasElement` |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: the fringe sample canvas.

### Oscilloscope — 2026-09-30

Compliance passed. Lint, typecheck, tests (152), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `Waveform.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `SignalGeneratorPanel.ts` hardcodes `OpenLyceum · FG-100` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | gap | `OscilloscopeDisplayNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, the generator badge, and display drag.

### FluidDynamics — 2026-09-30

Compliance passed. Lint, typecheck, tests (121), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `FluidDynamicsScreenIcons.ts` uses hex gradient stops |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | `FluidFieldNode.ts` owns the WebGPU canvas |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: screen-icon colors.

### MotionSensor — 2026-09-30

Compliance passed. Lint, typecheck, tests (74), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `SensorPositionSource.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `GraphControlsPanel.ts` hardcodes `(` and `)` around the axis names |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, and the axis-label punctuation.

### CapacitorLab — 2026-09-30

Compliance passed. Lint, typecheck, tests (59), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | gap | `describeDisposalLeaks([])` never disposes a sim object |
| model | follow | |
| constants | follow | |
| numerics | gap | `BatteryNode.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `BarMeterNode.ts` uses `new Text("0")` |
| i18n | follow | |
| new-sim | follow | |
| disposal | gap | same empty memory-leak case list |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: memory-leak suite, battery readout formatting, and the meter zero label.

### SpecialRelativity — 2026-09-30

Compliance passed. Lint, typecheck, tests (166), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | follow | |
| sound | n/a | |

No follow-up.

### HeatTransfer — 2026-09-30

Compliance passed. Lint, typecheck, tests (95), and the production build passed. Prior fuzz: pass (2026-08-19). `SimParams` in the WGSL shader is a uniform name, not a leftover template type.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `MaterialsScreenView.ts` uses `Number.toFixed`; `CpuParticleSystem.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `TemperatureLegendNode.ts` hardcodes `°C` and builds tick labels with a template string |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | `FieldEngine.ts` owns the documented GPU canvas |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, and the temperature legend text.

### WaveComposer — 2026-09-30

Compliance passed. Lint, typecheck, tests (78), and the production build passed. Prior fuzz: pass (2026-08-19). Leak tests dispose `Decimator` and `VoiceAnalyzer` with `forceGC(ref)`; the trailing `describeDisposalLeaks([])` adds no sim case.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | n/a | |
| custom-drawing | gap | `SpectrogramNode.ts` paints an offscreen `HTMLCanvasElement` |
| animation | n/a | |
| sound | gap | `SharedAudioContext.ts` constructs `AudioContext` directly |

Addressed 2026-09-30: spectrogram canvas, and audio bypasses tambo.

### MercuryElongations — 2026-09-30

Compliance passed. Lint, typecheck, tests (33), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `MercurySkyNode.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | gap | `MercurySkyNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, and sky drag.

### CrystalLattice — 2026-09-30

Compliance passed. Lint, typecheck, tests (203), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `CubicCellNode.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | gap | `Lattice2DNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: cell color, and the 2D lattice drag.

### FluidPressureAndFlow — 2026-09-30

Compliance passed. Lint, typecheck, tests (130), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `units.ts` uses `Number.toFixed`; `FlowModel.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `SceneRadioButtonGroup.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `WaterTowerKeyboardHelpContent.ts` is hand-built |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `HoseNode.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, a scene label, water-tower keyboard help, and the hose color.

### ACPhasor — 2026-09-30

Compliance passed. Lint, typecheck, tests (177), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `PhaseArcNode.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `CircuitDiagramNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | gap | `ResonanceScreenView.ts` still has a `Sim*` identifier |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | graph drag in `GraphInteractionHandler.ts` is not in the help dialog |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `ResistorNode.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, a circuit label, rename residue, graph-drag help, and the resistor color.

### MotionsOfTheSun — 2026-09-30

Compliance passed. Lint, typecheck, tests (144), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `TimeJumpPanel.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `HourCircleOnHorizonNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | gap | `AnalogClockNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, an hour-circle label, and the clock drag.

### OscillationsAndChaos — 2026-09-30

Compliance passed. Lint, typecheck, tests (9), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `PendulumLabProtractorNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | gap | `OscillationsAndChaosKeyboardHelpContent.ts` is hand-built |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `OscillationsAndChaosScreenIcons.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | gap | `src/init.ts` sets a sound flag without a matching `soundManager` registration |

Addressed 2026-09-30: protractor label, keyboard help, screen-icon color, and sound setup.

### TrackLab — 2026-09-30

Compliance passed. Lint, typecheck, tests (61), and the production build passed. Prior fuzz failed on 2026-08-19 and was fixed in that run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `GraphControlsPanel.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `TableRenderer.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | follow | |
| custom-drawing | gap | `OpenCVTracker.ts` uses an `HTMLCanvasElement` |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: a graph label, the table renderer color, and the tracker canvas.

### RotatingSky — 2026-09-30

Compliance passed. Lint, typecheck, tests (48), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | follow | |
| screen-view | follow | |
| strings | gap | `EditableNumberFieldNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | gap | `CoordinateGuideNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | follow | |
| sound | n/a | |

Addressed 2026-09-30: a number-field label, and the coordinate-guide drag.

### BasicCoordinatesAndSeasons — 2026-09-30

Compliance passed. Lint, typecheck, tests (66), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `FlatSkyMapNode.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `EditableNumberFieldNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | gap | `GlobeObserverDragNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | follow | |
| sound | n/a | |

Addressed 2026-09-30: numerics, a number-field label, and globe drag.

### Resonance — 2026-09-30

Compliance passed. Lint, typecheck, tests (456), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `ParticleManager.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `OscillatorVectorNode.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | follow | |
| sound | gap | `ResonanceSonification.ts` does not go through `soundManager` |

Addressed 2026-09-30: numerics, a vector label, and sonification.

### Zenith — 2026-09-30

Compliance failed: `package.json` keywords are missing `physics`. Lint, typecheck, tests (169), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `format.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `ObserverLocationNode.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | follow | |
| drag-listener | gap | `ObserverLocationNode.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: the missing `physics` keyword, numerics, the observer color, and observer drag.

### QuantumPotential — 2026-09-30

Compliance passed. Lint, typecheck, tests (105), and the production build passed. Not in the 2026-08-19 fuzz run.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `Schrodinger1DSolver.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | gap | `SuperpositionDialog.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | gap | `src/init.ts` sets a sound flag without a matching `soundManager` registration |

Addressed 2026-09-30: numerics, a superposition label, and sound setup.

### OpticsLab — 2026-09-30

Compliance passed. Lint, typecheck, tests (423), and the production build passed. Prior fuzz: pass (2026-08-19).

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `DivergentBeam.ts` uses `Math.random()` |
| screen-view | follow | |
| strings | gap | `DetectorChartPanel.ts` has a hardcoded `Text` |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | gap | `OpticsLabScreenIcons.ts` has a color literal outside `*Colors.ts` |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | follow | |
| enumeration | n/a | |
| drag-listener | follow | |
| custom-drawing | follow | |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, a detector label, and the screen-icon color.

### PlateTectonics — 2026-09-30

Compliance passed. Lint, typecheck, tests (364), and the production build passed. Prior fuzz: pass (2026-08-19). Generated data under `src/common/data/generated/` was not read.

| Skill | Score | Gap |
|---|---|---|
| coding-conventions | follow | |
| testing | follow | |
| model | follow | |
| constants | follow | |
| numerics | gap | `CrustScreenSummaryContent.ts` uses `Number.toFixed` |
| screen-view | follow | |
| strings | follow | |
| i18n | follow | |
| new-sim | follow | |
| disposal | follow | |
| preferences | follow | |
| query-parameters | follow | |
| keyboard-help-dialog | follow | |
| accessibility | follow | |
| optionize | follow | |
| color-profiles | follow | |
| layout | follow | |
| ui-controls | follow | |
| model-view-transform | n/a | |
| enumeration | follow | |
| drag-listener | gap | `attachGlobeRotation.ts` uses pointer `DragListener` with no keyboard drag |
| custom-drawing | gap | `DeepTimeCanvasNode.ts` uses an `HTMLCanvasElement` |
| animation | n/a | |
| sound | n/a | |

Addressed 2026-09-30: numerics, globe rotation drag, and the deep-time canvas.

## Scientific correctness review — 2026-11-06

Scope: the five most recently catalogued simulations. Baton catalog history records
HabitabilityLab and ExoplanetsDatabase on November 6, TransitHunter and StellarWobble on
November 5, and ElectronConfiguration on November 2. Only four additions fall on November 5–6;
ElectronConfiguration was included as the fifth under the stated scope assumption.

Six distinct correctness findings were identified. All were corrected in the follow-up below.

| Priority | Finding | Affected simulations |
|---|---|---|
| P1 | Stellar and planetary mass factors are swapped in the tidal-lock calculation; a representative time is too long by about 100,000 times | HabitabilityLab |
| P1 | Archive upper mass limits are treated as measured central values, yielding misleading densities and definite escape speeds | ExoplanetsDatabase, HabitabilityLab |
| P2 | Pure-iron guide extrapolates a rocky-planet fit outside its composition range; radius error reaches 19.3% against the author's table | ExoplanetsDatabase, TransitHunter |
| P2 | Coarse light-curve bins reduce noise without averaging brightness; a reproduced discrepancy is 3,342 ppm | TransitHunter |
| P2 | Switching stellar mass during late zoom resets age outside the displayed timeline | HabitabilityLab |
| P2 | Inverted bounds filter no planets but display an ordered archive interval | ExoplanetsDatabase |

No actionable correctness defect was confirmed in the reviewed StellarWobble or
ElectronConfiguration paths. Per-repository evidence, recommendations, and limitations:

- [HabitabilityLab](HabitabilityLab/doc/correctness-review-2026-11-06.md)
- [ExoplanetsDatabase](ExoplanetsDatabase/doc/correctness-review-2026-11-06.md)
- [TransitHunter](TransitHunter/doc/correctness-review-2026-11-06.md)
- [StellarWobble](StellarWobble/doc/correctness-review-2026-11-06.md)
- [ElectronConfiguration](ElectronConfiguration/doc/correctness-review-2026-11-06.md)

Node v26.13.0. All five passed lint, all type checks, production builds, existing unit tests
(495 total), and pointer/keyboard fuzz (10 seconds per mode). All 18 screens across the four
astronomy apps initialized and reset at desktop/phone sizes with randomized listener order.
ElectronConfiguration's 18 existing browser tests passed, including all screens in three locales.
Eight independent diagnostic assertions failed and reproduced the six findings; their source is
preserved in the relevant reports, and temporary test files were removed.

Local compliance passed with warnings; remote security checks were skipped (`gh` unavailable).
Template drift was limited to Vitest declarations in HabitabilityLab, ExoplanetsDatabase,
and TransitHunter (`^5.1.0` versus template `^5.0.5`). NASA TAP queries timed out; the mass-limit
finding was verified against the bundled values and the original Kepler-62 paper instead.


### Correctness remediation — 2026-11-06

All six findings are corrected in HabitabilityLab, ExoplanetsDatabase and TransitHunter, with
permanent regressions and regenerated data. The tidal fix uses the full Gladman equation,
including the Love number; its red-dwarf preset now locks at 13.7 Myr. The snapshot gained
verified archive limit flags without changing existing values, and the shoreline now contains
611 measured planets. Table/card inequalities, density bounds, filtered/plot samples, range
normalization, numerical iron curves and coarse-bin brightness averaging are consistent.

The corresponding local handouts and instructor keys now explain limits and corrected counts,
locking ages and timeline resolution, and binning. Relevant screenshots and Word exports were
rebuilt. The three Vitest declarations were also aligned with the template (`^5.0.5`), preserving
installed versions already allowed by that range. At the end of local remediation, changes had
not yet been committed, pushed or deployed.

Validation of the corrected repositories: 210 unit tests passed (48 + 44 + 118), lint,
all type checks, builds, six pointer/keyboard smoke tests, and targeted production-browser
checks across 14 screens at desktop/phone sizes. The displayed upper bounds, 3,163 measured
masses, normalized filters, red-dwarf locking readout and averaged brightness were checked in
Chromium. All six Word exports passed ZIP/XML, content and freshness checks. Local compliance
and template-drift checks passed; remote security probes remain outside this local correction.

### Publication — 2026-11-06

The completed corrections and review reports were committed on `main` in their owning repos:

| Repository | Commit |
|---|---|
| HabitabilityLab | `1274aba` |
| ExoplanetsDatabase | `7ea5da8` |
| TransitHunter | `664701f` |
| StellarWobble | `77a9fd4` |
| ElectronConfiguration | `86ca625` |

At the user's request to commit everything, `handouts/` is now tracked in this workspace,
including Markdown, Word exports, figures, and regeneration tools. Build caches and nested
`node_modules/` remain ignored. Member repositories remain independent and ignored here.

## Fleet fuzz review — 2026-11-15

Scope: all 74 simulations returned by `Baton/scripts/parse-repos.sh names --simulation`,
using their local, clean `main` checkouts. Each ran the standard `npm run test:fuzz`:
pointer (`?fuzz&ea`) and keyboard (`?fuzzBoard&ea`), 30 seconds per mode, seed `20261115`,
Node v26.13.0, headless Playwright Chromium. Four simulations ran concurrently with distinct
`FUZZ_PORT` values (5300–5373), `CI=1`, and the template's existing WebGPU launch flags.

The initial batch passed 73 simulations (147 of 148 individual tests). CapacitorLab's
pointer test passed, but its keyboard test exceeded the existing 150-second timeout without
reporting an assertion or console error. Its retained trace showed slow browser evaluation
calls under concurrent load. Replaying the same seed in isolation for **60 seconds per mode**
passed both tests in 175.9 seconds overall. The timeout did not reproduce; the evidence is
consistent with resource contention. No timeout or assertion was weakened, and no simulation
source change was warranted by this run. All 74 simulation working trees remained clean.

SceneryStackTemplate also passed both modes in isolation at 30 seconds per mode with the
same seed (67.3 seconds overall). Final outcome: all 74 simulations plus the template have
passing pointer and keyboard results; no reproducible application defect was found.

Reproduce the longer isolated check inside CapacitorLab with Node 26:

```sh
CI=1 FUZZ_SEED=20261115 FUZZ_PORT=5390 npm run test:fuzz -- 60
```

Local evidence is under `/tmp/fleet-fuzz-20261115/`: per-repository logs and JSON results,
`baseline.json` with tested commit IDs, and the original CapacitorLab failure trace/video
under `artifacts/CapacitorLab/`. These temporary artifacts are outside version control.
This is a single-seed browser fuzz smoke review; it does not establish exhaustive screen,
physics, accessibility, or physical-sensor coverage. Unit tests, lint, type checks, and builds
were not rerun because no application source or test harness changed.


## Numeric constants review — 2026-11-15

Selected the twenty newest catalogued simulations by the timestamp of each local repository’s first
commit (2026-10-31 through 2026-11-12), rather than its most recent maintenance commit.

Extracted **5,091 numeric literal occurrences across 483 source files** in nineteen member repos into
their existing root `*Constants.ts` modules. The settings cover layout, typography, rendering, defaults,
solver limits, tolerances, random-generator parameters, acquisition timing and calibration. Grouped
constants use `as const`; unit comments distinguish physical quantities, pixels, counts and ratios.
SimplifiedMRI’s existing constants coverage needed no source changes in this pass.

The review preserves mathematical coefficients, array/tuple indices, named scientific and protocol
tables, and shader implementations. This is a review of meaningful settings, not a ban on every
numeric literal. Template infrastructure and scientific snapshots were left intact.

An AST comparison resolved extracted constants back to their original expressions and confirmed
equivalence for all 483 changed consumer modules. Explicit numeric annotations preserve the original
parameter and local-variable types where literal inference changed after hoisting.

| Simulation | Source files updated | Numeric occurrences extracted |
|---|---:|---:|
| DataLab | 9 | 65 |
| Lasers | 3 | 26 |
| NuclideChart | 29 | 339 |
| HRDiagram | 16 | 120 |
| SimplifiedMRI | 0 | 0 |
| ParticleZoo | 20 | 137 |
| ColliderLab | 11 | 101 |
| DiffractionLab | 12 | 37 |
| BackwardAcceleration | 25 | 263 |
| BiomechanicsArm | 12 | 130 |
| CartCollisions | 26 | 221 |
| PhotonInteractions | 31 | 442 |
| PlanetaryConfigurations | 36 | 346 |
| HabitabilityLab | 40 | 459 |
| ExoplanetsDatabase | 28 | 285 |
| TransitHunter | 39 | 538 |
| StellarWobble | 36 | 410 |
| ElectronConfiguration | 13 | 249 |
| RelativisticDynamics | 32 | 382 |
| QuantumAtom3D | 65 | 541 |

Validation under Node 26: all twenty simulations pass `lint`, `check`, `test`, `build`,
`check:architecture` and `git diff --check` (154 test files; 1,455 passing unit tests).
Browser pointer/keyboard fuzz: all twenty simulations pass (40 browser tests). The required
`brand.js` first-import order was also verified in all twenty entrypoints.

Sensor protocol and calibration refactors were checked with existing tests and expression equivalence;
physical PASCO hardware was not available for testing.


## Numeric constants review, simulations 21–40 — 2026-11-15

Continued the previous batch’s **newest-first ordering by each repository’s first-commit
timestamp** (not catalog/alphabetical order). The next twenty run from LewisStructures
through HeatTransfer.

Hoisted **5,027 numeric literal occurrences across 537 consumer source files** into the
existing root `*Constants.ts` modules. Grouped settings use `as const`; the extraction covers
layout, typography, rendering, defaults, initial instrument positions, solver limits,
tolerances, sample timing and manual time steps. Values and equations are unchanged.
ElectricFieldMapper’s architecture guidance now points to its root constants module.

Preserved mathematical coefficients, array/tuple indices, scientific and protocol tables,
generated coastlines, shader implementations and scientific colour data. FluidPressureAndFlow’s
documented pool/pipe geometry constants remain local to those models.

| Position | Simulation | Consumer source files updated | Numeric occurrences extracted |
|---:|---|---:|---:|
| 21 | LewisStructures | 30 | 204 |
| 22 | EquilibriumLab | 36 | 321 |
| 23 | CalorimetryLab | 28 | 409 |
| 24 | Electrochemistry | 20 | 386 |
| 25 | TitrationLab | 24 | 320 |
| 26 | PeriodicTrends | 19 | 140 |
| 27 | LightAndAtoms | 26 | 281 |
| 28 | SpectroscopyLab | 36 | 500 |
| 29 | MolScope | 22 | 128 |
| 30 | ElectricFieldMapper | 16 | 179 |
| 31 | MercuryElongations | 20 | 197 |
| 32 | CapacitorLab | 35 | 172 |
| 33 | MotionSensor | 18 | 172 |
| 34 | FluidPressureAndFlow | 45 | 501 |
| 35 | MotionMatch | 17 | 132 |
| 36 | RadioactivityAndStatistics | 19 | 165 |
| 37 | StandingWaves | 36 | 260 |
| 38 | FieldBoundary | 23 | 165 |
| 39 | InterferometryLab | 37 | 262 |
| 40 | HeatTransfer | 30 | 133 |

An AST comparison expanded every extracted setting back to its original expression and
confirmed equivalence across all 537 changed consumer modules. It also verified that all
pre-existing root constants and registrations remain unchanged. Numeric annotations preserve
writable numeric locals and default-parameter types where literal inference would narrow them.

Validation under Node 26: all twenty simulations pass `lint`, `check`, `test`, `build`,
`check:architecture` and `git diff --check` (161 test files; 1,965 passing unit tests).
The `brand.js` first-import requirement is preserved in every entrypoint.

Browser pointer/keyboard fuzz: all twenty simulations pass (40 browser tests, 10 seconds
of fuzz activity per mode). The sandbox initially blocked localhost server binding; the
same unchanged test commands passed with local-server access enabled.

Evidence is under `/tmp/constants-batch2/`: the selected repositories, original source
snapshots, baseline commit IDs, expression-equivalence results, per-repository validation
logs and extraction counts. Changes were committed separately in all twenty independent member repositories.
Real PASCO devices were not available; this review validates the existing simulated and
mocked acquisition paths rather than physical sensor operation.


## Numeric constants hygiene, simulations 21–40 — 2026-11-16

Reviewed the batch-2 hoist against `Baton/skills/scenerystack-constants` and the batch-1
follow-up bar (`fix(constants): correct mislabeled hoist names and units`). The hoist was
behavior-equivalent (empty AST equivalence diff, unused-extracted empty, lint/check/test/build/
architecture/fuzz green under Node 26), but unclean: AST-derived names
(`FONT_FONT_SIZE`, `LEFT_LEFT`/`TOP_TOP`/`BOTTOM_BOTTOM`, `X_X`/`Y_Y`, `P_H_*`, `__LABEL_*`,
`OPACITY_OPACITY`, `LINE_WIDTH_LINE_WIDTH`), wrong unit comments (metres/V/m/counts/ratios/
magnitudes tagged as px), a few leftover duplicate literals, and missing AGENTS pointers.

Applied the same hygiene pass as batch 1 in every sim (new commit; hoist commit left intact):
renamed opaque keys from consumer context, corrected unit JSDoc, wired CapacitorLab
`CLCalibration` to shared spacing settings, fixed ElectricFieldMapper metre/V/m labels and the
ExploreScreenView `0.18` drag margin, corrected MolScope stride/`toFixed` labels, collapsed
HeatTransfer’s duplicated `CANVAS_SCALE`, and documented root `*Constants.ts` in AGENTS for
FieldBoundary, InterferometryLab, CapacitorLab, SpectroscopyLab, MotionSensor, and MotionMatch.
Icon polyline `SEGMENT_*` keys and import-before-JSDoc placement were left as in batch 1.

Opaque doubled/illegal names above are cleared in all twenty Constants modules. Each sim’s
`fix(constants)` commit passed `lint` and `check` (unit tests rerun where exercised by the
agents). Not pushed.


## Oldest ten simulations — functional code review — 2026-11-16

Selected catalogued simulations by their earliest root commit's author timestamp (source-history age, not GitHub creation date). All ten started with clean working trees. Reports record the exact reviewed commits and reproducible findings. The findings below describe the review baseline; the remediation entry records their resolution.

| Oldest first | First commit date | Existing tests | Review |
|---|---|---:|---|
| DopplerEffect | 2025-03-26 | 47 | [Report](DopplerEffect/doc/code-review-2026-11-16.md) |
| OscillationsAndChaos | 2025-10-22 | 66 | [Report](OscillationsAndChaos/doc/code-review-2026-11-16.md) |
| Resonance | 2025-11-02 | 469 | [Report](Resonance/doc/code-review-2026-11-16.md) |
| QuantumPotential | 2025-11-11 | 110 | [Report](QuantumPotential/doc/code-review-2026-11-16.md) |
| TrackLab | 2026-02-17 | 81 | [Report](TrackLab/doc/code-review-2026-11-16.md) |
| OpticsLab | 2026-02-24 | 459 | [Report](OpticsLab/doc/code-review-2026-11-16.md) |
| LadyBug | 2026-05-24 | 17 | [Report](LadyBug/doc/code-review-2026-11-16.md) |
| TheRamp | 2026-05-24 | 23 | [Report](TheRamp/doc/code-review-2026-11-16.md) |
| MazeGame | 2026-05-25 | 18 | [Report](MazeGame/doc/code-review-2026-11-16.md) |
| ElectricFieldOfDreams | 2026-05-26 | 15 | [Report](ElectricFieldOfDreams/doc/code-review-2026-11-16.md) |

Six confirmed functional findings:

| Priority | Simulation | Finding |
|---|---|---|
| P1 | QuantumPotential | All four views step the model again after Joist, doubling automatic time/phase evolution |
| P2 | DopplerEffect | Rewind restores old velocities without the old sound speed, violating the subsonic constraint |
| P2 | TrackLab | Uneven sample spacing produces derivatives assigned to the wrong time; x=t² gives 3 instead of 2 m/s at t=1 |
| P2 | Resonance | Chladni's paused Step callback advances no particles |
| P2 | TheRamp | Recording from the past leaves abandoned future samples in force/energy/work graphs |
| P2 | LadyBug | Rewind displays the first advanced state at time zero because the initial snapshot is missing |

No additional actionable functional defect was confirmed in the reviewed OscillationsAndChaos, OpticsLab, MazeGame or ElectricFieldOfDreams paths. An unused Resonance bandwidth property also has a zero-damping discrepancy, documented separately in its report.

Under Node v26.13.0, all ten pass lint, app/scripts/test type checks, production builds, architecture checks and existing unit suites: **1,305 tests total**. QuantumPotential initially exceeded a 2 s performance assertion under concurrency; its full unchanged suite passed in isolation. TrackLab's baseline was rerun after a temporary diagnostic-file discovery/removal race and passed. Six diagnostic assertions reproduced the functional findings; their sources are retained in the owning reports, and temporary test files were removed.

Local compliance passes with warnings; remote GitHub security settings could not be checked. All ten have pre-existing template drift: all declare Biome ^2.6.5 versus template ^2.6.6; seven also differ in biome.json; OscillationsAndChaos/TrackLab/Resonance have dependency-order drift; Resonance declares Vitest ^5.0.5 versus template ^5.1.0. Full output is preserved in each report.

This was a targeted review of model, control, recording, numerical and lifecycle paths, with broad automated validation. No new browser fuzz, live camera/video, heap profiling, manual screen-reader audit or educator sign-off was performed. Prior November 15 fleet fuzz remains separate evidence. Local logs, baseline commits, diagnostic sources and output: `/tmp/oldest-review/`.


### Oldest-ten remediation and commits — 2026-11-16

All six functional findings are corrected, along with Resonance’s dormant zero-damping
bandwidth calculation and all reported template drift. Permanent regression coverage now
checks the four quantum screen callbacks, Doppler parameter/emission replay, nonuniform
track derivatives, Chladni paused stepping, LadyBug initial snapshots and TheRamp graph
branching. TheRamp’s new event includes SceneryStack runtime parameter metadata, verified
by an assertion-enabled unit test and a repeated browser fuzz run after the initial smoke
run exposed the missing metadata.

Biome declarations, schemas and locked executables are aligned to the template’s 2.6.6
patch. Resonance’s Vitest declaration and dependency ordering are aligned as well;
documented per-simulation configuration exceptions remain intact. All ten pass the final
template-drift check. The installer sorted package dependencies alphabetically, so the
catalog checker’s shared-first ordering was reapplied afterward.

| Repository | Commit | Passing unit tests |
|---|---|---:|
| DopplerEffect | `d42852d7` | 49 |
| OscillationsAndChaos | `c8a05cbb` | 66 |
| Resonance | `6746f831` | 471 |
| QuantumPotential | `c44a3221` | 114 |
| TrackLab | `d390385a` | 85 |
| OpticsLab | `7ac1ee37` | 459 |
| LadyBug | `02a19311` | 20 |
| TheRamp | `f50d5ca3` | 25 |
| MazeGame | `78872493` | 18 |
| ElectricFieldOfDreams | `0ba28119` | 15 |

Validation under Node v26.13.0: **1322 passing unit tests**, lint, all type checks,
production builds, architecture checks, local compliance and template drift. These are
17 additional regression cases beyond the 1,305-test review baseline. QuantumPotential’s
full solver suite passed without weakening its performance assertions. A new Resonance
test initially inferred a narrow Property type; its generic annotation was corrected and
the complete type check passed afterward.

All ten also pass pointer and keyboard browser fuzz: **20 passing browser tests**, seed
`20261116`, 10 seconds of fuzz activity per mode, headless Playwright Chromium. Localhost
access was required because the sandbox blocked the Vite test servers. No live camera or
physical hardware validation, manual screen-reader audit or remote security-settings
verification is claimed.

Each owning repository contains its review report and changes in the commit listed above.
All ten working trees were clean after their commits. Local validation logs and scripts
are retained in the ignored workspace directory `.review-artifacts/oldest-fixes/`.
Commits are local; no push or deployment was performed.
