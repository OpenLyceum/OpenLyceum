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

- Hardcoded `Text` remains in SternGerlach, Precession, QubitSketch, ACPhasor, MotionsOfTheSun, OscillationsAndChaos, RotatingSky, BasicCoordinatesAndSeasons, Resonance, and QuantumPotential.
- Color literals remain outside `*Colors.ts` in FluidPressureAndFlow and on the OpticsLab screen icons.
- TrackLab’s OpenCV tracker and the PlateTectonics globe relief still use an `HTMLCanvasElement` so they can read pixels back.
- The Vernier caliper, the Rotating Sky coordinate guide, and the Basic Coordinates globe stay pointer-only: their arrow keys are already owned.

MazeGame, ExtrasolarPlanets, CarnotHeatEngine, and SpecialRelativity had no follow-up.

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

