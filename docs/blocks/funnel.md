# Funnel

A narrowing sequence of stages, each bar's width proportional to the
first stage's value, with every stage's value and drop-off rate as
real text.

## Data shape

```ts
interface FunnelStage {
  label: string;
  value: number;
}

interface FunnelData {
  stages: FunnelStage[];
  unit?: string;
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`FunnelTool` manages a repeatable list of label/value stage rows plus a
tone picker, following the same pattern as `BarsTool`.

## Astro / MDX

```mdx
<Funnel stages={[
  { label: "Visitors", value: 1000 },
  { label: "Signups", value: 500 },
  { label: "Paid", value: 120 },
]} />
```
