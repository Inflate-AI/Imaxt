# Formula

Typeset math via [KaTeX](https://katex.org), rendered at render time with
no client-side JavaScript required. The only block in the package with a
runtime dependency (`katex`), added as a direct dependency of
`packages/core` - see the `imaxt-formula-block` OpenSpec change for the
reasoning.

## Data shape

```ts
interface FormulaData {
  tex: string;
  display?: boolean;   // block ("display") math vs inline math; default false
  caption?: string;
}
```

A malformed `tex` value never throws - KaTeX renders its own inline error
marker in place of typeset output instead.

## EditorJS

`FormulaTool` is a simple field-based tool: a LaTeX input, a display-mode
checkbox, and an optional caption field.

## Astro / MDX

```mdx
<Formula tex="E=mc^2" caption="Mass-energy equivalence" />

<Formula tex="\int_0^\infty e^{-x}\,dx = 1" display />
```
