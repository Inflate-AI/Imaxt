# Ranked

A numbered ranking list with an optional movement indicator per item —
real text throughout, not a color-only signal.

## Data shape

```ts
interface RankedItem {
  label: string;
  value?: string;
  delta?: number | 'new' | 'same';
}

interface RankedData {
  items: RankedItem[];
  unit?: string;    // appended to each printed value, e.g. "%"
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`RankedTool` manages a repeatable list of label/value/delta rows plus a
tone picker, following the same pattern as `BarsTool`.

## Astro / MDX

```mdx
<Ranked unit="%" items={[
  { label: "Model A", value: "92", delta: 3 },
  { label: "Model B", value: "88", delta: "new" },
  { label: "Model C", value: "81", delta: -2 },
]} />
```
