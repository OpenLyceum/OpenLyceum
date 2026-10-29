# AGENTS.md — OpenLyceum superproject

This repo is a **thin workspace bootstrapper**, not an application. It tracks only its own root files (`README.md`, `bootstrap.sh`, `.gitignore`, `.gitattributes`, `.claude/`, the logos, `review-log.md`, and this file). Every member repo (`Baton/`, `.github/`, the sims, `Almanach/`, …) is an **independent git repo** cloned in by `bootstrap.sh` and gitignored here, so `git status` in the superproject stays clean no matter what state they're in.

## Before doing anything

- **There is no `package.json` at the root.** Do not run `npm install` / `npm run build` / tests here. All dev, lint, typecheck, build, and test commands live **inside each member repo** — `cd` into it first.
- **Member repos are independent.** To change a sim, `cd <SimName>` and branch/commit/push there. Nothing in this superproject needs updating afterward (no submodules, no pointers). Don't `git add` member-repo paths from here — they're ignored.
- **If the workspace is incomplete**, run `./bootstrap.sh` (re-runnable; skips repos already present). It clones `Baton` first, then hands off to `Baton/scripts/clone-fleet.sh`, which reads the catalog. Flags (forwarded to `clone-fleet.sh`): `--simulation`, `--update` (fast-forward existing), `--dry-run`, `--https`, `--quiet`.

## Where the guidance lives (read in this order)

Authoritative docs are **not** in this superproject — they live in the cloned repos. Check the layered sources before guessing:

1. **Sim-specific** → `<Sim>/AGENTS.md` (architecture, key files, physics, quirks). Read this first when working in a sim.
2. **All SceneryStack sims** → `.github/AGENTS.md` — tech stack, the bootstrap import chain, standard layout, coding conventions, SceneryStack module paths, CI, git hooks, tests. The single richest shared reference; do not duplicate it here.
3. **Deep per-topic** → `Baton/skills/` (index: `Baton/skills/README.md`) and `Almanach/` (VitePress knowledge base; generated `Almanach/docs/public/llms.txt` / `llms-full.txt` are LLM-consumable).
4. **Structure & accessibility rules** → `Baton/CONVENTIONS.md` and `Baton/ACCESSIBILITY.md`, enforced by Baton's compliance check.

## Baton is the source of truth for org operations

`Baton/` carries everything operational — don't duplicate it elsewhere:

- **`Baton/structure/repos.json`** — machine-readable catalog of every org repo. The bootstrapper, compliance audit, Pages index, and every `Baton/scripts/*` tool read it. A repo missing from this file is invisible to the tooling.
- **`Baseline/`** — immutable upstream ground truth for sims (`baselines.json` + `scripts/fetch-baselines.sh` for pinned git clones; non-git snapshots committed in-tree). Listed in the catalog as `type: tool`.
- **`Baton/.github/workflows/*.yml`** — reusable CI/CD (`ci`, `deploy`, `shared-codeql`, `shared-dependency-review`, `shared-compliance-check`) plus Baton-run jobs (`fleet-health`, `fleet-exec`, `pages`, `refresh-screenshots`, `optimize-assets`, `sync-dependabot`, `gitlab-mirror`, `baton-selfcheck`). Each sim's `ci.yml` calls `uses: OpenLyceum/Baton/.github/workflows/ci.yml@main` plus the shared dependency-review and CodeQL workflows.
- **`Baton/scripts/`** — fleet tooling. High-use commands:
  - `Baton/scripts/parse-repos.sh names --simulation` — list simulation repo names
  - `Baton/scripts/check-repo-compliance.sh <repo>` — local compliance audit for one sim
  - `Baton/scripts/fleet-exec.sh --simulation -- <cmd>` — fan a command across sims (dry-run by default; `--apply` opens one PR per repo and needs a write-scoped `GH_TOKEN` locally, or the `FLEET_PAT` secret when run as the `fleet-exec.yml` workflow)
  - `Baton/scripts/fleet` (or `fleet` on PATH) — ad-hoc git across local checkouts (`fleet status -s`, `fleet pull --ff-only`); cheat sheet: `Baton/doc/fleet-git.md`
- **`Baton/config/`** — Dependabot + Claude-settings templates synced into member repos.
- Node version is **26** fleet-wide, kept in sync across all Baton workflows; `Baton/scripts/check-node-version.sh` enforces it (run in `baton-selfcheck.yml`). Each sim's `devEngines` makes npm refuse to run on an older local Node.

## `.github` vs `Baton` split

- **`.github/`** — only what GitHub *must* serve from the special repo: community-health defaults (`CONTRIBUTING.md`, `LICENSE`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue/PR templates, org profile) **plus** the shared `.github/AGENTS.md`. Its local `.github/.github/workflows/` only deploys the org profile page.
- **`Baton/`** — everything operational: CI workflows, catalog, scripts, conventions, skills, Pages.
- Don't add workflows to `.github`, and don't add community-health files to `Baton`.

## Conventions that bite if missed

- **Sim repos use `AGENTS.md`, not `CLAUDE.md`.** Each member sim (and `.github`) keeps an `AGENTS.md` for AI-assistant guidance; do not add a parallel `CLAUDE.md`.
- **Compliance check (sims) FAILs on:** a root `CONTRIBUTING.md` or `LICENSE` (use the org defaults from `.github`); a `README.md` without exactly six sections **in order** — Features → Quick Start → Scripts → Tech Stack → License → Contributing (no extra top-level sections); a `.github/workflows/ci.yml` that doesn't call Baton's reusable CI, dependency-review, and CodeQL workflows. It also FAILs on a missing `.github/dependabot.yml`, `engines.node` / `@types/node` / `devEngines.runtime` not matching Node 26, a broken bootstrap chain (`main.ts`'s first import must be `./brand.js`), missing `<Prefix>Namespace.ts` / `<Prefix>Colors.ts` at `src/` root or `*Constants.ts` under `src/`, and a missing `.claude/settings.json` (sync with `Baton/scripts/sync-claude-settings.sh`). Source of truth: `Baton/scripts/check-repo-compliance.sh`.
- **TypeScript 7 + Biome, not ESLint/Prettier.** No `enum`, no `namespace`, `import type` for type-only imports, `.js` extensions in `.ts` import paths. Full list in `.github/AGENTS.md`. Run `npm run lint && npm run check && npm run build` (plus `npm test` if defined) inside the sim before a PR.
- **Git hooks** (`.githooks/` in each sim) auto-activate on `npm install`: pre-commit runs `npm run fix` on staged `.ts`/`.js`/`.json`/`.html` files, pre-push runs `lint` + `check`. Bypass only with `git commit/push --no-verify`.

## Tracking new files in this superproject

`.gitignore` ignores everything (`/*`) then re-includes an allowlist (the root files listed at the top, plus `CONVENTIONS.md` / `ACCESSIBILITY.md` placeholders). **To commit a new root-level file here, add a `!/your-file` line to `.gitignore`** — otherwise it stays ignored. Member-repo contents need no entry; the top-level `/*` already covers them (so stray artifacts like `ACPhasor.zip` are ignored too).
