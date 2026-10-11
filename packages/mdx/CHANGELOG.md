# @inflate-ai/imaxt-mdx

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
