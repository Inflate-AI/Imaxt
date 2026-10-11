# Marquee

A horizontally scrolling band of words, used as a section break. Static
(no motion) under `prefers-reduced-motion: reduce`.

## Data shape

```ts
interface MarqueeData {
  words: string[];
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
  bleed?: boolean;
  seconds?: number;  // one full loop's duration; default: 34
}
```

## EditorJS

`MarqueeTool` — a single input for comma-separated words, plus a tone
picker.

## Astro / MDX

```mdx
<Marquee words={["Embed", "Filter", "Rank", "Repeat"]} tone="accent" />
```
