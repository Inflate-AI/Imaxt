# Scorecard

A dense grid of labeled metrics — a smaller-scale sibling of `StatRow`
with no count-up animation and no nested children.

## Data shape

```ts
interface ScorecardItem {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
}

interface ScorecardData {
  items: ScorecardItem[];
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`ScorecardTool` manages a repeatable list of label/value/unit/delta
rows plus a tone picker, following the same pattern as `BarsTool`.

## Astro / MDX

```mdx
<Scorecard items={[
  { label: "MRR", value: 42000, unit: "$" },
  { label: "Churn", value: "2.1", unit: "%", delta: "-0.4" },
]} />
```
