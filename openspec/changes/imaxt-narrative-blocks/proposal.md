# Proposal

## Why

Second of five batches building Imaxt toward v1.0.0. Authors writing
long-form articles need a vocabulary for narrative scaffolding - a
severity-leveled aside, a Q&A list, a short "key takeaways" box, an inline
footnote, a term glossary, a head-to-head framing distinct from `Compare`,
and a static checklist - none of which the 15 shipped blocks or the batch-1
data blocks cover well.

## What Changes

- Add seven new blocks to `block-render-engine`: `Callout`, `Faq`,
  `Takeaways`, `Footnote`, `Glossary`, `Versus`, `Checklist`.
- `Faq` uses native `<details>`/`<summary>` for its disclosure behavior -
  zero client-side JavaScript, unlike `TypeLab`/`Scrolly`/`CodeWalk`'s
  `attach*` functions. `Footnote` uses the same native-disclosure pattern
  for its reveal.
- All seven are standalone blocks (no composite parent/child pair),
  following the batch-1 precedent: `Faq`/`Takeaways`/`Glossary`/`Checklist`
  take an `items` array; `Callout`/`Footnote` take a single `html` body like
  `Sidenote`; `Versus` takes a fixed two-entry `sides` tuple as plain data
  (not slotted children), distinguishing it from `Compare` (which is
  composite with free-form slotted content per side) by being a lighter,
  data-only framing block.
- Each is exposed via the existing generic `editorjs-authoring`,
  `astro-components`, and `mdx-compilation` requirements - no capability-level
  changes needed there.
- No new runtime dependencies.

## Capabilities

### Modified Capabilities

- `block-render-engine`: seven new block requirements added (`Callout`,
  `Faq`, `Takeaways`, `Footnote`, `Glossary`, `Versus`, `Checklist`).

## Impact

- **Packages touched**: `packages/core`, `packages/editorjs`, `packages/astro`,
  `packages/mdx`.
- **Dependencies**: none added.
- **Versioning**: minor release (`0.2.0` → `0.3.0`) via changeset.
