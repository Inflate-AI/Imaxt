# Matrix

A feature/capability comparison grid, rendered as a real `<table>` so
every cell's value is text, not a color-only signal.

## Data shape

```ts
type MatrixCell = 'yes' | 'no' | 'partial' | string;

interface MatrixData {
  rows: string[];
  cols: string[];
  cells: MatrixCell[][];   // cells[rowIndex][colIndex]; must match rows/cols dimensions
  caption?: string;
}
```

## EditorJS

`MatrixTool` manages the `rows` and `cols` label arrays as two
repeatable lists, and a cell grid that resizes to match. `validate()`
rejects saved data whose `cells` dimensions don't match `rows`/`cols`.

## Astro / MDX

```mdx
<Matrix
  caption="Plan comparison"
  rows={["Free", "Pro"]}
  cols={["Exports", "Support"]}
  cells={[
    ["no", "no"],
    ["yes", "yes"],
  ]}
/>
```
