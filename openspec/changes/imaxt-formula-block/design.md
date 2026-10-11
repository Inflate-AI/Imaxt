# Design

## Why a direct dependency is the right call here

Every other block in this batch avoided a new dependency by computing
its own minimal logic (`Diff`'s LCS, `Sparkline`'s inline SVG). Math
typesetting is different: there is no minimal from-scratch implementation
of TeX math layout worth writing, and KaTeX is the de facto standard for
exactly this - small (no runtime framework dependency of its own),
actively maintained, and already battle-tested across the web. Treating
it as a direct dependency of `packages/core` (not a peer dependency the
consuming site must separately install) keeps `Formula` working the same
way every other block already does: import `@inflate-ai/imaxt-core`,
call a `render*` function, get HTML back - no extra setup step unique to
this one block.

## Zero client JS

`katex.renderToString(tex, { displayMode, throwOnError: false })` runs
entirely server-side (or at build time, in Astro's case) and returns
static HTML with inline MathML for accessibility - no client-side
JavaScript is shipped or required to display the result, matching the
cost profile of `Statement`/`Bars`/`Heatmap` rather than `TypeLab`/
`Scrolly`. `throwOnError: false` means a malformed `tex` string renders
KaTeX's own inline error markup instead of throwing, so one bad formula
in a long document never takes down the rest of the render.

## Styles

KaTeX ships its own stylesheet (and the web font files it references).
`packages/core/src/styles.css` gains one more `@import` line, in the
same position and spirit as the existing Fraunces variable-font imports
- a consuming site's bundler (Vite/Astro, same as the blog already uses)
resolves the `node_modules`-relative `@import` and the font `url()`s it
contains, exactly as it already does for Fraunces.

## Data shape

```ts
interface FormulaData {
  tex: string;
  display?: boolean;   // block ("display") math vs inline math; default false
  caption?: string;
}
```
