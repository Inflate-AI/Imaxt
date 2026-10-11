# Gauge

A value shown as a proportional fill against a max, with the numeric
value always present as real text alongside the fill.

## Data shape

```ts
interface GaugeData {
  value: number;
  max: number;
  label?: string;
  unit?: string;
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`GaugeTool` is a simple field-based tool (value, max, label, unit) plus
a tone picker.

## Astro / MDX

```mdx
<Gauge value={42} max={100} label="Capacity" unit="%" />
```
