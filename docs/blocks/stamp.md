# Stamp

A short rotated typographic marker, like a "DRAFT" or "APPROVED" stamp.

## Data shape

```ts
interface StampData {
  text: string;
  angle?: number;    // rotation in degrees; default: -8
  tone?: string;      // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`StampTool` is a simple field-based tool: text, an optional angle, and a
tone picker.

## Astro / MDX

```mdx
<Stamp text="DRAFT" angle={-6} tone="accent" />
```
