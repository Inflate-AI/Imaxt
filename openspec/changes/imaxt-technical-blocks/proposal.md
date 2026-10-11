# Proposal

## Why

Third of five batches building Imaxt toward v1.0.0. Technical-writing posts
need a vocabulary beyond `CodeWalk`'s step-by-step annotation: a raw
command/output transcript, a line-level diff, a directory listing, a styled
error/stack display, and a version-by-version changelog.

## What Changes

- Add five new blocks to `block-render-engine`: `Terminal`, `Diff`,
  `FileTree`, `ErrorBox`, `Changelog`.
- `Diff` computes its own line-level diff from `before`/`after` text (a
  minimal LCS-based line diff implemented in `packages/core`, no external
  dependency) rather than requiring the author to pre-compute one.
- All five are standalone blocks, following the batch-1/2 precedent.
- Each is exposed via the existing generic `editorjs-authoring`,
  `astro-components`, and `mdx-compilation` requirements - no
  capability-level changes needed there.
- No new runtime dependencies.

## Capabilities

### Modified Capabilities

- `block-render-engine`: five new block requirements added (`Terminal`,
  `Diff`, `FileTree`, `ErrorBox`, `Changelog`).

## Impact

- **Packages touched**: `packages/core`, `packages/editorjs`, `packages/astro`,
  `packages/mdx`.
- **Dependencies**: none added.
- **Versioning**: minor release (`0.3.0` → `0.4.0`) via changeset.
