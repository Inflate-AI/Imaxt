# Stat / StatRow

A row of large numerals with labels. A purely-numeric `value` counts up
from zero once it first scrolls into view; the final value is always
present as text, so it's correct even with JavaScript off.

## Data shape

```ts
interface StatData {
  value: string | number;  // "5", "10×", 42 - only a purely-numeric value animates
  label: string;
  unit?: string;            // e.g. "ms"
  note?: string;
  tone?: string;             // mint | lilac | sky | rose | accent | ink | white (default: ink)
}

interface StatRowData {
  items: StatData[];
}
```

## EditorJS

`StatRowTool` is composite: one tool manages a repeatable list of Stat
entries (value, unit, label, note, tone each with its own tone picker),
with add/remove controls. There is no separate `StatTool`.

## Astro / MDX

```mdx
<StatRow>
  <Stat value="5" unit="ms" label="p95 query time" tone="mint" />
  <Stat value="10×" label="fewer calls" tone="sky" />
  <Stat value="0" label="images in this post" />
</StatRow>
```

`StatRow` is a thin `<slot />` wrapper; each `Stat` child renders itself
(and wires its own count-up behavior) independently.

## Notes

- Count-up is skipped entirely under `prefers-reduced-motion: reduce` and
  when JavaScript doesn't run — the final value is already in the markup
  either way.
