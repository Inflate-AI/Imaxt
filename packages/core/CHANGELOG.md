# @inflate-ai/imaxt-core

## 1.1.0

### Minor Changes

- c3e0f67: Production-readiness pass on the editor and its tone system:
  
  - `imaxt-core`: preset tones (mint/lilac/sky/rose) now get real dark-mode colors instead of the light pastel swatch with swapped text, which made text unreadable in dark mode on Statement, StatRow, Scorecard, Banner, Marquee, and CurvedText. Dark mode now applies both by OS preference and by an explicit `data-theme="dark"` attribute. Adds `toneAttrs`/`isCustomTone`/`autoOnColor` so any tone field can also take a literal `#rrggbb` custom color with an automatically contrast-safe text color. Delta is visually redesigned (a tone-colored chip with a directional badge) instead of plain unstyled text.
  - `imaxt-editor`: fixes the slash menu silently dropping multi-word searches ("type lab", "pull quote", ...) and leaving the typed text behind as dead paragraph text. Fixes TypeLab (and Ticker/Scrolly/CodeWalk/StatRow) rendering inert in both the live block preview and Render mode by wiring up their client-side behavior after render, the same way a published page does. Render mode now reuses the exact same classed markup as the Write mode's own contentEditable, so the two are pixel-identical - the only difference is editability. Raw mode is now a full-page view instead of a boxed textarea. `ImaxtEditorTheme` gains `toneMint`/`toneLilac`/`toneSky`/`toneRose`/`onTone` so a consumer's `theme` prop can carry correct per-scheme tone colors. The block editor's tone field is now a swatch picker with a custom-color option instead of a plain preset dropdown.
- 57dfd57: Add GFM support (tables, task lists, strikethrough, autolinks) to `imaxt-mdx`'s MDX parsing and serialization, and a new `Embed` block (a link card for external URLs, with an optional caption) across `imaxt-core`, `imaxt-editorjs`, `imaxt-astro`, and `imaxt-mdx`'s compiler. Also exports `blockToMdastNode`/`mdastNodeToBlock` from `imaxt-mdx` for converting a single block without a document wrapper.
- f8af798: Adds a `Mermaid` block (`renderMermaid`/`attachMermaid` in `imaxt-core`, a `<Mermaid>` component in `imaxt-mdx`'s compiler and `imaxt-astro`, reachable from the editor's slash menu under Technical) - a real diagram rendered client-side with the `mermaid` library, themed from Imaxt's own tone tokens so it matches light/dark/custom themes automatically, lazily loaded so it costs nothing until a diagram is actually on the page.
  
  Fixes a real, systemic layout bug: Bars, Steps, Timeline, Ranked, Funnel, Sidenote, Callout, PullQuote, and Stat all had their core layout CSS (list-style reset, grid, background, padding) gated behind a `.prose` ancestor class that only Blog's own article wrapper provides - so every one of them rendered with broken or missing spacing inside the editor (both the live block preview and Render mode), which Blog's own layout happened to mask. That gate is removed; the same blocks keep their existing non-`.prose` ancestry.
  
  Fixes a real data-loss bug in `imaxt-mdx`'s JS-literal parser used for expression-attribute props (e.g. an array of chart items): it only handled an escaped quote or backslash, silently mangling any other backslash escape sequence (`\n`, `\t`, ...) instead of interpreting it, so a string value containing one of those would round-trip corrupted.
  
  Raw mode now grows to fit its content and lets the page scroll, instead of scrolling inside its own fixed-height box like a form input - matching Write and Render mode.
  
  The editor demo's sample article is rewritten from a self-referential "look what we built" piece into actual documentation of what Imaxt is, its six block categories, the tone system, and how to use the editor - typeset using Imaxt's own blocks throughout, including the new Mermaid block for a real architecture diagram.

## 1.0.0

### Major Changes

- b4bed4a: First stable release. 40 blocks across all four packages (render engine, EditorJS tools, Astro components, MDX compiler), each shipped test-first with its own OpenSpec change. No breaking changes from `0.6.0` - this release commits to the semver stability guarantees of `1.0.0` for the public API documented in `docs/blocks/`.

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
