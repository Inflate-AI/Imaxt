# Sparkline

An inline trend line sized for prose flow, carrying a text alternative
(`aria-label`) summarizing the trend since the line itself doesn't
expose individual points as text.

## Data shape

```ts
interface SparklineData {
  values: number[];
  label?: string;
}
```

## EditorJS

`SparklineTool` is a simple field-based tool: a comma-separated values
input plus a label.

## Astro / MDX

```mdx
<Sparkline values={[12, 18, 9, 24]} label="Weekly signups" />
```
