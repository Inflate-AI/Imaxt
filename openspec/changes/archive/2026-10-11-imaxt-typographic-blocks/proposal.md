# Proposal

## Why

Fifth and final batch building Imaxt's new block library toward v1.0.0.
This batch rounds out the purely visual/typographic vocabulary: a
cycling phrase ticker, an oversized opening letter, a click-to-reveal
redaction, a rotated stamp marker, and a static oversized banner word.

## What Changes

- Add five new blocks to `block-render-engine`: `Ticker`, `DropCap`,
  `Redacted`, `Stamp`, `Banner`.
- `Redacted` reveals its content via a native `<details>`/`<summary>`
  element styled as a redaction bar - zero client-side JavaScript,
  following the `Faq`/`Footnote` precedent from earlier batches.
- `Ticker` is the only block in this batch needing client-side JS (cycling
  through phrases); it renders every phrase in the DOM up front so the
  no-JS and `prefers-reduced-motion` fallback is simply "all phrases
  visible, none cycling" rather than a separate code path.
- `DropCap`, `Stamp`, and `Banner` are fully static.
- Each is exposed via the existing generic `editorjs-authoring`,
  `astro-components`, and `mdx-compilation` requirements - no
  capability-level changes needed there.
- No new runtime dependencies.

## Capabilities

### Modified Capabilities

- `block-render-engine`: five new block requirements added (`Ticker`,
  `DropCap`, `Redacted`, `Stamp`, `Banner`).

## Impact

- **Packages touched**: `packages/core`, `packages/editorjs`, `packages/astro`,
  `packages/mdx`.
- **Dependencies**: none added.
- **Versioning**: minor release (`0.5.0` → `0.6.0`) via changeset. This
  completes the five-batch v1.0.0 component-library push; a follow-up
  `imaxt-v1.0.0-stabilization` change locks the API and tags the 1.0.0
  release itself.
