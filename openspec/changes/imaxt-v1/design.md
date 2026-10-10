# Design

## Context

Greenfield Bun workspace (see proposal.md - Why). The reference implementation
for every block's visual output and prop shape is
`saranmahadev/blog/src/components/imaxt/*.astro` (19 `.astro` files, ~413
lines total), `src/styles/imaxt.css` (tone tokens), and `src/components/imaxt/
{index.ts,types.ts}`. That repo is not touched by this change; it is read-only
reference material for this package's behavior.

## Goals / Non-Goals

**Goals:**
- One rendering implementation per block, reused unchanged by the EditorJS
  tool's live preview and by the Astro component's final output.
- Every package independently buildable, typecheckable, testable, and
  publishable from `bun`.
- TDD throughout: for each block/package unit, a test is written (and
  observed to fail or to clearly state the intended behavior) before the
  implementation that satisfies it.

**Non-Goals:**
- Wiring this into `saranmahadev/blog` or any EditorJS-based builder app
  (separate future change).
- Any block beyond the 19 existing ones plus `ImaxtCover`.
- Actually executing `npm publish` (requires an authenticated npm account/org
  this change does not have).

## Decisions

### Package boundaries: 4 packages, matching the 4 capabilities
`core` / `editorjs` / `mdx` / `astro`, each owning exactly one capability from
the proposal. Alternative considered: a single package with subpath exports.
Rejected because `editorjs` and `astro` have mutually exclusive peer
dependencies and runtime environments (browser-only Block Tool vs.
Astro-compile-time component); forcing both into one package's dependency
graph would make the `astro`-only consumer install EditorJS's peer
dependency tree for no reason, and vice versa.

### `core` has zero runtime dependencies and no framework
Render functions return HTML strings; interactivity is exported as
`attach(element, data): () => void` (cleanup-returning) functions that touch
only standard DOM APIs (`IntersectionObserver`, `matchMedia`,
`prefers-reduced-motion`). This is what lets the same code run inside an
EditorJS tool's `render()` (real browser DOM) and inside an Astro component's
SSR output (string concatenation, no DOM) without a adapter layer per
consumer.

### TypeLab: React island → vanilla TypeScript
The source repo's `TypeLab.tsx` is a React component. Porting it to vanilla
TS keeps `core` dependency-free and lets the *same* implementation run inside
the EditorJS canvas (which has no React runtime unless the host builder
happens to be React) and inside Astro (as a `client:visible` island with no
React hydration cost). Alternative considered: keep it React, ship a
`core/react` subpath. Rejected for this pass - adds a second framework
runtime for one block; revisit only if a future block genuinely needs React
state/composition that vanilla DOM can't express cleanly.

### Composite blocks: one EditorJS tool with an internal repeatable list
`StatRow`, `Compare`, `Steps`, `Timeline`, `Scrolly`, `CodeWalk` each become
one Block Tool managing an array field internally (add/remove controls),
mirroring the pattern EditorJS's own `List`/`Table` tools use. Alternative
considered: representing each child as its own EditorJS block and grouping
via EditorJS's block-grouping/nesting support. Rejected: that feature is not
stable across EditorJS 2.x, and modeling children as separate top-level
blocks would let an author accidentally split a `Timeline` apart by dragging
one `Event` out, which has no sensible MDX representation.

### `mdx` package: direct `mdast-util-*` + `micromark-extension-*`, no `unified`
`mdast-util-from-markdown`/`mdast-util-to-markdown` are called directly with
`mdast-util-mdx` and `mdast-util-frontmatter` as syntax/mdast extensions.
`unified`'s plugin-pipeline abstraction buys nothing here since there is
exactly one parse step and one stringify step, each a plain function call;
adding it would be an unused layer.

### `mdx` package: unrecognized MDX passes through as a generic block
`mdxToBlocks` must not drop content it doesn't recognize (plain prose,
non-Imaxt JSX) per the `mdx-compilation` spec. A generic `{ type: "markdown",
source: string }` block carries that content through untouched, and
`blocksToMdx` re-emits its `source` verbatim for that block type.

### Build tooling: `bun build` for JS, `tsc --emitDeclarationOnly` for types
Keeps the toolchain Bun-first (per the original ask to build this "using
bun") without reaching for a second bundler (tsup/esbuild wrapper) that would
only add a `.d.ts`-emission feature `tsc` already provides directly. The
`astro` package ships its `.astro` sources unbuilt (the standard approach for
Astro component libraries - the consuming site's own Astro compiler compiles
them); its "build" step is `astro check`.

### Dependency versions: latest stable everywhere, with one documented pin
Every dependency is pinned to the version `npm view <pkg> version` reported
at the time this change was authored (not a caret range, since this change
authors the first release and should state the exact set it was tested
against; a maintainer can relax to caret ranges in a later change).
Exception: `packages/astro`'s `typescript` devDependency is pinned to
`6.0.3` instead of the workspace-wide `7.0.2`, because `astro check` (via
`@astrojs/check`) does not yet support TypeScript 7 (confirmed by running it:
"astro check does not currently support TypeScript 7.0"). Bun's workspace
installer resolves this correctly - `packages/astro` gets its own nested
`typescript@6.0.3` since its `package.json` requests a version incompatible
with the hoisted `7.0.2`.

### Test environment: `bun test` + `happy-dom` via a preload script
`bunfig.toml`'s `[test] preload` registers `happy-dom`'s `GlobalRegistrator`
before any test file runs, giving every package's test suite a real DOM
(`document`, `IntersectionObserver`, etc.) without per-test setup
boilerplate or a second test runner.

## Risks / Trade-offs

- [Risk] Porting 19 blocks' visual/behavioral detail from `.astro` source by
  hand-reading risks subtle mismatches (exact class names, whitespace-
  sensitive CSS selectors) that don't show up as logical test failures. →
  Mitigation: tests assert the documented *behavior* (the spec scenarios),
  not implementation details like exact class names; where a scenario can't
  capture a purely visual detail (e.g. exact CSS tint curve on Heatmap), the
  CSS itself is carried over near-verbatim from `imaxt.css` rather than
  rewritten, to avoid introducing visual drift.
- [Risk] `astro` package pinned to an older TypeScript than the rest of the
  workspace could drift further out of sync as TS7 tooling support lands. →
  Mitigation: documented inline in this file and in that package's own
  `package.json` is self-describing (one version string); revisiting it is a
  one-line change whenever `@astrojs/check`/`ts-content-mapper` adds TS7
  support.
- [Risk] Shipping as the very first release (`0.1.0`) of four public packages
  with exact-pinned dependency versions means consumers get no automatic
  patch updates. → Mitigation: acceptable for a `0.1.0`; a follow-up change
  can widen ranges once the API has a release or two of real usage.

## Migration Plan

Not applicable in the deployment sense (greenfield packages, nothing to
migrate away from). Build order, to keep every step independently testable:
`core` → `editorjs` and `mdx` (parallel, both depend only on `core`) →
`astro` (depends only on `core`) → workspace-wide build/typecheck/lint/test →
publish-readiness pass on all four `package.json`s.
