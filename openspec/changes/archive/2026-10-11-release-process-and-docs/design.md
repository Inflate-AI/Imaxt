# Design

## Context

See proposal.md for motivation. This change touches only repo process and
documentation: `.github/workflows/`, root-level community files, `docs/`,
and the root `package.json`'s dev tooling. No file under `packages/*/src`
changes.

## Goals / Non-Goals

**Goals:**
- Git hooks that actually run for anyone who clones and runs `bun install`,
  with no separate manual setup step.
- A release workflow whose only job is getting a version to npm - nothing
  it does duplicates what the local hooks already proved.
- A `docs/` structure where adding a 20th block is "add one file, add one
  index row," not "find the right section in a growing document."

**Non-Goals:**
- Replacing or restructuring the OpenSpec workflow itself.
- Any change to package behavior, specs, or the `imaxt-v1` change (already
  merged in spirit, left un-archived for the user's own review).
- A CI safety net for contributions that bypass local hooks - the proposal
  names this explicitly as an accepted tradeoff, not something this design
  works around.

## Decisions

### Git hooks: `simple-git-hooks`, not Husky or Lefthook
`simple-git-hooks` writes plain shell scripts directly into `.git/hooks/`
from a `simple-git-hooks` key in `package.json`, with a `postinstall`
script (`simple-git-hooks`) that (re)installs them on every `bun install`.
No wrapper shell framework, no extra config file, one new devDependency.
Husky v9 is comparable but adds its own `.husky/` directory of wrapper
files for no benefit here; Lefthook is a Go binary, which would be the
one non-JS, non-Bun-resolved tool in an otherwise all-JS toolchain.

### Hook split: lint on commit, everything on push
`bun run lint` (Biome) finishes in well under a second, so it runs on
every commit with no perceptible delay. `bun run typecheck && bun test &&
bun run build` takes several seconds (astro check's Vite startup is most
of it) - acceptable once per push, not once per commit. Push is also the
more meaningful gate: commits are allowed to be work-in-progress, but
nothing should leave the machine unverified.

### Release workflow: build + Changesets, no test step
Changesets' own GitHub Action already distinguishes "there are unreleased
changesets" (open/update a version-bump PR) from "that PR was merged"
(actually run `npm publish` per package). That split is itself the
"automated" part: no one ever types `npm publish` by hand. Removing the
test step here is safe specifically because pre-push already ran the full
suite before any commit reached `main` - re-running it in the one place
with no human watching adds latency without adding confidence.

### `docs/` layout: one page per `core` module pairing, not per MDX tag
`packages/core/src/*.ts` already groups composite parents with their
children (`stat.ts` holds both `Stat` and `StatRow`, `compare.ts` holds
both `Side` and `Compare`, etc.) - 15 modules for 19 blocks + the cover.
`docs/blocks/` mirrors that exact grouping (15 pages), so a doc page's
scope always matches a source module's scope: whoever adds or changes a
block already knows which doc file to touch. Each page covers the same
four things in the same order (data shape, EditorJS usage, Astro/MDX
usage, notes), so a new page is a template fill-in, not a design decision.
`docs/blocks/README.md` is the one file that must gain a row for a new
block; everything else under `docs/` is unaffected by adding one.

## Risks / Trade-offs

- [Risk] A contributor who edits via GitHub's web UI, or passes
  `--no-verify`, ships unvalidated code with nothing to catch it. →
  Mitigation: explicitly accepted per the proposal; documented in
  `docs/publishing.md` so it is a known, stated tradeoff rather than a
  surprise.
- [Risk] `docs/blocks/README.md`'s index can drift out of sync with the
  per-block pages if a future contributor adds a page but forgets the
  index row. → Mitigation: the index table and the page list are both
  small and reviewed in the same PR that adds a block; no tooling enforces
  this for v1, which is an acceptable manual step at this scale.

## Migration Plan

Not applicable (no runtime migration). Sequencing: remove `ci.yml` and
rewrite `release.yml` first (so the repo is never without a working
release path), then add hooks, then write the root community files and
`docs/`, then validate the hooks actually install and fire before
committing.
