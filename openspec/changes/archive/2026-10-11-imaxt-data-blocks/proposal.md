# Proposal

## Why

Imaxt v1 shipped 15 blocks but has no dedicated vocabulary for small, dense
numeric claims - a ranking, a feature matrix, a single before/after number, a
progress-against-target gauge, a cluster of related metrics, an inline trend,
or a narrowing funnel. Authors currently reach for `Bars` or `StatRow` for all
of these even when the shape doesn't fit, or fall back to a plain Markdown
table. This is the first of five batches building out Imaxt toward a v1.0.0
release with a comprehensively larger block library.

## What Changes

- Add seven new blocks to `block-render-engine`: `Ranked`, `Matrix`, `Delta`,
  `Gauge`, `Scorecard`, `Sparkline`, `Funnel`. Every one is a **standalone**
  block (no composite parent/child pair, no slotted children) - each takes a
  single data object with an `items`/`stages`/`rows`+`cols` array inline,
  following the same shape `Bars` and `Heatmap` already use.
- Each is exposed as an EditorJS tool (`editorjs-authoring`), an Astro
  component (`astro-components`), and a compiler mapping (`mdx-compilation`)
  via the existing generic requirements those three capabilities already
  state - no capability-level changes needed there, since none of these seven
  blocks introduces a new authoring pattern (nesting, nested nested children,
  nested content, etc.) beyond what `Bars`/`Heatmap`/`Statement` already
  cover.
- No new runtime dependencies; no new client-side interactivity (all seven
  render as static, server-rendered markup, matching the already-established
  "20 of 25 need no client JS" plan for this v1.0.0 push).

## Capabilities

### Modified Capabilities

- `block-render-engine`: seven new block requirements added (`Ranked`,
  `Matrix`, `Delta`, `Gauge`, `Scorecard`, `Sparkline`, `Funnel`).

## Impact

- **Packages touched**: `packages/core`, `packages/editorjs`, `packages/astro`,
  `packages/mdx` (each gets 7 new render functions/tools/components/compiler
  mappings plus tests).
- **Dependencies**: none added.
- **Versioning**: minor release (`0.1.4` → `0.2.0`) via changeset - additive,
  no breaking change to any existing block's public API.
