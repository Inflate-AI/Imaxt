# Heatmap

A real `<table>` whose cells are tinted by value. The number is always
printed in the cell too — color is never the only signal.

## Data shape

```ts
interface HeatmapData {
  rows: string[];
  cols: string[];
  data: number[][];   // data.length === rows.length; each row's length === cols.length
  caption: string;
  unit?: string;
  min?: number;         // value mapped to the lightest cell; default: the data's minimum
  max?: number;         // value mapped to the darkest cell; default: the data's maximum
  wide?: boolean;
}
```

## EditorJS

`HeatmapTool` — caption/rows/cols inputs (rows and cols as comma-separated
labels) plus a grid of number inputs that resizes when you edit the
rows/cols lists.

## Astro / MDX

```mdx
<Heatmap
  caption="Common modes, one digit per audience"
  rows={["600", "640", "644", "755"]}
  cols={["Owner", "Group", "Others"]}
  data={[[6, 0, 0], [6, 4, 0], [6, 4, 4], [7, 5, 5]]}
  min={0}
  max={7}
/>
```
