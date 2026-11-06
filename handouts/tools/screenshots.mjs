// Screenshots for the handouts, taken from a sim's local Vite dev server.
//
//   node handouts/tools/screenshots.mjs <shots.json>
//
// shots.json: { "simDir": "../StellarWobble", "base": "http://localhost:5191/",
//               "outDir": "../StellarWobble/img",
//               "shots": [ { "name": "doppler", "query": "screens=1", "steps": [ ... ] } ] }
// Paths are relative to the JSON file. Steps (run in order):
//   { "wait": 500 }                                   pause, ms
//   { "role": "slider", "name": "Radial velocity", "keys": ["End", "PageDown"] }
//                                                     focus a parallel-DOM control, press keys
//   { "role": "checkbox", "name": "Telescope view", "keys": ["Space"] }
//   { "role": "checkbox", "name": "Log scale", "nth": 1, "keys": ["Space"] }   second match
//   { "div": "Age of the star", "keys": [["ArrowRight", 150]] }   focusable div by exact text
//   { "click": [x, y] }                               click in layout coordinates (1024×618 view)
//   { "drag": [x1, y1, x2, y2] }
//   { "press": "Space" }                              key on whatever has focus
//   { "clip": [x, y, w, h] }                          crop the final image (layout coordinates)
// The sims draw into a 1024×618 layout; the viewport keeps that aspect so coordinates are stable.

import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const specPath = resolve(process.argv[2]);
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const here = dirname(specPath);
const simDir = resolve(here, spec.simDir);
const outDir = resolve(here, spec.outDir);
mkdirSync(outDir, { recursive: true });

const require = createRequire(`${simDir}/package.json`);
const { chromium } = require("playwright");

const W = 1024;
const H = 618;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });

for (const shot of spec.shots.filter((s) => !process.argv[3] || s.name === process.argv[3])) {
  await page.goto(`${spec.base}?${shot.query ?? ""}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(shot.settle ?? 2500);
  let clip;
  for (const step of shot.steps ?? []) {
    if (step.wait) await page.waitForTimeout(step.wait);
    if (step.role || step.div) {
      const el = step.div
        ? page.locator("div", { hasText: new RegExp(`^${step.div}$`) }).first()
        : page.getByRole(step.role, { name: step.name, exact: step.exact ?? false }).nth(step.nth ?? 0);
      await el.focus();
      for (const key of step.keys ?? []) {
        const [k, n] = Array.isArray(key) ? key : [key, 1];
        for (let i = 0; i < n; i++) await page.keyboard.press(k);
      }
    }
    if (step.press) await page.keyboard.press(step.press);
    if (step.click) await page.mouse.click(step.click[0], step.click[1]);
    if (step.drag) {
      const [x1, y1, x2, y2] = step.drag;
      await page.mouse.move(x1, y1);
      await page.mouse.down();
      await page.mouse.move(x2, y2, { steps: 12 });
      await page.mouse.up();
    }
    if (step.clip) clip = { x: step.clip[0], y: step.clip[1], width: step.clip[2], height: step.clip[3] };
    await page.waitForTimeout(step.after ?? 150);
  }
  // Move focus off the controls so no focus highlight shows.
  await page.mouse.click(2, H - 2);
  await page.waitForTimeout(400);
  const path = `${outDir}/${shot.name}.png`;
  await page.screenshot({ path, clip });
  console.log("wrote", path);
}
await browser.close();
