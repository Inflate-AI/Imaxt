# Ticker

A discrete cycling phrase, like a tiny headline rotator. Every phrase is
in the DOM up front; without client-side JavaScript, or under
`prefers-reduced-motion: reduce`, all phrases stay visible rather than
cycling.

## Data shape

```ts
interface TickerData {
  phrases: string[];
  seconds?: number;   // interval between phrases; default: 3
  tone?: string;       // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`TickerTool` manages a repeatable list of phrase rows plus a tone
picker, following the same pattern as `BarsTool`.

## Astro / MDX

```mdx
<Ticker phrases={['Embed', 'Filter', 'Rank']} seconds={4} />
```
