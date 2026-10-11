# Delta

A single before/after value, with a direction indicator computed
automatically when both values are numeric.

## Data shape

```ts
interface DeltaData {
  label: string;
  from: string | number;
  to: string | number;
  unit?: string;
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`DeltaTool` is a simple field-based tool (label, from, to, unit) plus a
tone picker, like `Sidenote`.

## Astro / MDX

```mdx
<Delta label="Latency" from={120} to={80} unit="ms" />
```
