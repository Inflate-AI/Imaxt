# @inflate-ai/imaxt-mdx

## 1.1.0

### Minor Changes

- 57dfd57: Add GFM support (tables, task lists, strikethrough, autolinks) to `imaxt-mdx`'s MDX parsing and serialization, and a new `Embed` block (a link card for external URLs, with an optional caption) across `imaxt-core`, `imaxt-editorjs`, `imaxt-astro`, and `imaxt-mdx`'s compiler. Also exports `blockToMdastNode`/`mdastNodeToBlock` from `imaxt-mdx` for converting a single block without a document wrapper.
- f8af798: Adds a `Mermaid` block (`renderMermaid`/`attachMermaid` in `imaxt-core`, a `<Mermaid>` component in `imaxt-mdx`'s compiler and `imaxt-astro`, reachable from the editor's slash menu under Technical) - a real diagram rendered client-side with the `mermaid` library, themed from Imaxt's own tone tokens so it matches light/dark/custom themes automatically, lazily loaded so it costs nothing until a diagram is actually on the page.
  
  Fixes a real, systemic layout bug: Bars, Steps, Timeline, Ranked, Funnel, Sidenote, Callout, PullQuote, and Stat all had their core layout CSS (list-style reset, grid, background, padding) gated behind a `.prose` ancestor class that only Blog's own article wrapper provides - so every one of them rendered with broken or missing spacing inside the editor (both the live block preview and Render mode), which Blog's own layout happened to mask. That gate is removed; the same blocks keep their existing non-`.prose` ancestry.
  
  Fixes a real data-loss bug in `imaxt-mdx`'s JS-literal parser used for expression-attribute props (e.g. an array of chart items): it only handled an escaped quote or backslash, silently mangling any other backslash escape sequence (`\n`, `\t`, ...) instead of interpreting it, so a string value containing one of those would round-trip corrupted.
  
  Raw mode now grows to fit its content and lets the page scroll, instead of scrolling inside its own fixed-height box like a form input - matching Write and Render mode.
  
  The editor demo's sample article is rewritten from a self-referential "look what we built" piece into actual documentation of what Imaxt is, its six block categories, the tone system, and how to use the editor - typeset using Imaxt's own blocks throughout, including the new Mermaid block for a real architecture diagram.

### Patch Changes

- Updated dependencies [c3e0f67]
- Updated dependencies [57dfd57]
- Updated dependencies [f8af798]
  - @inflate-ai/imaxt-core@1.1.0

## 1.0.0

### Major Changes

- b4bed4a: First stable release. 40 blocks across all four packages (render engine, EditorJS tools, Astro components, MDX compiler), each shipped test-first with its own OpenSpec change. No breaking changes from `0.6.0` - this release commits to the semver stability guarantees of `1.0.0` for the public API documented in `docs/blocks/`.

### Patch Changes

- Updated dependencies [b4bed4a]
  - @inflate-ai/imaxt-core@1.0.0

## 0.6.0

### Minor Changes

- 16e6a33: Add five new visual/typographic blocks: `Ticker`, `DropCap`, `Redacted`, `Stamp`, and `Banner`. `Redacted` reveals its content via native `<details>`/`<summary>`, requiring no client-side JavaScript. This completes the five-batch v1.0.0 component-library push.

### Patch Changes

- Updated dependencies [16e6a33]
  - @inflate-ai/imaxt-core@0.6.0

## 0.5.0

### Minor Changes

- 64bce5f: Add a `Formula` block for typeset math via [KaTeX](https://katex.org), rendered with no client-side JavaScript. This adds `katex` as the first new runtime dependency of `packages/core` since the initial release.

### Patch Changes

- Updated dependencies [64bce5f]
  - @inflate-ai/imaxt-core@0.5.0

## 0.4.0

### Minor Changes

- 3f562fa: Add five new technical-writing blocks: `Terminal`, `Diff`, `FileTree`, `ErrorBox`, and `Changelog`. `Diff` computes its own line-level diff from plain `before`/`after` text using a minimal LCS algorithm, with no new dependency.

### Patch Changes

- Updated dependencies [3f562fa]
  - @inflate-ai/imaxt-core@0.4.0

## 0.3.0

### Minor Changes

- b9d03b7: Add seven new narrative/structure blocks: `Callout`, `Faq`, `Takeaways`, `Footnote`, `Glossary`, `Versus`, and `Checklist`. `Faq` and `Footnote` use native `<details>`/`<summary>` disclosure, requiring no client-side JavaScript.

### Patch Changes

- Updated dependencies [b9d03b7]
  - @inflate-ai/imaxt-core@0.3.0

## 0.2.0

### Minor Changes

- 2cc7397: Add seven new data/numbers blocks: `Ranked`, `Matrix`, `Delta`, `Gauge`, `Scorecard`, `Sparkline`, and `Funnel`. Each is available as a render function, an EditorJS tool, an Astro component, and an MDX compiler mapping.

### Patch Changes

- Updated dependencies [2cc7397]
  - @inflate-ai/imaxt-core@0.2.0

## 0.1.4

### Patch Changes

- Updated dependencies [9c2e811]
  - @inflate-ai/imaxt-core@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [a599cab]
- Updated dependencies [eb4b07a]
  - @inflate-ai/imaxt-core@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [abf5cc9]
  - @inflate-ai/imaxt-core@0.1.2

## 0.1.1

### Patch Changes

- ae34a00: Add a live npm version badge to each package's README, and verify the automated Trusted Publishing release pipeline end to end.
- Updated dependencies [ae34a00]
  - @inflate-ai/imaxt-core@0.1.1
