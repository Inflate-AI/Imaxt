# Bars

A ranking or comparison chart built from real text, not an image or
canvas — every value and label is selectable, readable text.

## Data shape

```ts
interface BarItem {
  label: string;
  value: number;
}

interface BarsData {
  items: BarItem[];
  max?: number;   // the value a full-width bar represents; default: the largest item's value
  unit?: string;   // appended to each printed value, e.g. "%"
  tone?: string;    // mint | lilac | sky | rose | accent | ink (default: ink)
}
```

## EditorJS

`BarsTool` manages a repeatable list of label/value rows (with add/remove
controls) plus a tone picker. Unlike the other repeatable blocks, Bars is
registered as one standalone tool (its items are a flat array prop, not
nested MDX children).

## Astro / MDX

```mdx
<Bars unit="%" max={100} tone="accent" items={[
  { label: "Model A", value: 72 },
  { label: "Model B", value: 81 },
  { label: "Model C", value: 64 },
]} />
```
