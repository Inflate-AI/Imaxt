# Proposal

## Why

Fourth of five batches building Imaxt toward v1.0.0. Technical and
scientific writing needs typeset math - Imaxt had no answer for this
until now. This change reverses an earlier design note (drafted while
scoping the v1.0.0 batch plan) that excluded math rendering over "no
heavy dependencies" concerns: KaTeX's `renderToString` is pure
server-side string transformation producing static HTML/MathML with zero
required client-side JavaScript - the same cost profile as every other
block in this package, not a heavier one.

## What Changes

- Add one new block to `block-render-engine`: `Formula`.
- Add `katex` as a direct (not peer) dependency of `packages/core` - the
  first new runtime dependency since `imaxt-v1`, justified the same way
  `@fontsource-variable/fraunces` already is: it is small, self-contained,
  and required for the block to render at all, not something a consuming
  site is expected to already have.
- `renderFormula` calls `katex.renderToString` at render time (no DOM,
  no client JS) and the package's `styles.css` gains an `@import` of
  KaTeX's own stylesheet, following the same `@import` pattern already
  used for the Fraunces variable-font CSS.
- Exposed via the existing generic `editorjs-authoring`,
  `astro-components`, and `mdx-compilation` requirements - no
  capability-level changes needed there.

## Capabilities

### Modified Capabilities

- `block-render-engine`: one new block requirement added (`Formula`).

## Impact

- **Packages touched**: `packages/core` (new dependency), `packages/editorjs`,
  `packages/astro`, `packages/mdx`.
- **Dependencies**: `katex` added as a direct dependency of
  `packages/core`; `@types/katex` as a devDependency.
- **Versioning**: minor release (`0.4.0` → `0.5.0`) via changeset.
