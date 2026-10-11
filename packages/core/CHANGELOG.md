# @inflate-ai/imaxt-core

## 0.6.0

### Minor Changes

- 16e6a33: Add five new visual/typographic blocks: `Ticker`, `DropCap`, `Redacted`, `Stamp`, and `Banner`. `Redacted` reveals its content via native `<details>`/`<summary>`, requiring no client-side JavaScript. This completes the five-batch v1.0.0 component-library push.

## 0.5.0

### Minor Changes

- 64bce5f: Add a `Formula` block for typeset math via [KaTeX](https://katex.org), rendered with no client-side JavaScript. This adds `katex` as the first new runtime dependency of `packages/core` since the initial release.

## 0.4.0

### Minor Changes

- 3f562fa: Add five new technical-writing blocks: `Terminal`, `Diff`, `FileTree`, `ErrorBox`, and `Changelog`. `Diff` computes its own line-level diff from plain `before`/`after` text using a minimal LCS algorithm, with no new dependency.

## 0.3.0

### Minor Changes

- b9d03b7: Add seven new narrative/structure blocks: `Callout`, `Faq`, `Takeaways`, `Footnote`, `Glossary`, `Versus`, and `Checklist`. `Faq` and `Footnote` use native `<details>`/`<summary>` disclosure, requiring no client-side JavaScript.

## 0.2.0

### Minor Changes

- 2cc7397: Add seven new data/numbers blocks: `Ranked`, `Matrix`, `Delta`, `Gauge`, `Scorecard`, `Sparkline`, and `Funnel`. Each is available as a render function, an EditorJS tool, an Astro component, and an MDX compiler mapping.

## 0.1.4

### Patch Changes

- 9c2e811: `TypeLab`'s sliders and sample-text input now have `id`/`for` associations between each control and its `<label>`, restoring what the original React island did with `useId()`. The server-rendered version had dropped this (axe-core flagged it as a critical "form elements must have labels" violation during the blog integration). The id is derived deterministically from the sample text, so `renderTypeLab` stays a pure function.

## 0.1.3

### Patch Changes

- a599cab: `CodeWalk` now accepts pre-rendered code markup - a `html` field on `CodeWalkData`, or (in `@inflate-ai/imaxt-astro`) a default slot - used in place of the plain-text rendering of `code`. `code` stays required: it's still the canonical, editable value for `@inflate-ai/imaxt-editorjs`. This lets an Astro/MDX consumer pass syntax-highlighted markup (e.g. from Astro's own `<Code>`) while `attachCodeWalk`'s line-dimming still works unchanged, since it only looks for `.line` elements regardless of their origin.
- eb4b07a: Restore the `white` tone, dropped from the exported `TONES`/`Tone` type during the original extraction even though its `[data-tone="white"]` CSS rule was carried over - `resolveTone('white')` was silently falling back to `'ink'`.

## 0.1.2

### Patch Changes

- abf5cc9: `ImaxtCover` now accepts an optional `style` string, appended after the `aspect-ratio` declaration on its root element - a generic escape hatch for a consumer that needs to tweak layout (e.g. a box-shadow or margin) without wrapping the component in an extra element.

## 0.1.1

### Patch Changes

- ae34a00: Add a live npm version badge to each package's README, and verify the automated Trusted Publishing release pipeline end to end.
