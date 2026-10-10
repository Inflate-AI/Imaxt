# Scrolly / Beat

A statement pinned beside the prose that swaps to match each "beat" as it
scrolls into view. Without JavaScript, or at a narrow viewport, every beat
instead shows its own stage/sub label inline with its content.

## Data shape

```ts
interface BeatData {
  stage: string;
  sub?: string;
  html: string; // this beat's body (plain, <strong>, <em>, <br>)
}

interface ScrollyData {
  items: BeatData[];
  tone?: string; // default: 'sky'
}
```

## EditorJS

`ScrollyTool` is composite: a repeatable list of Beat entries
(stage/sub/body), with add/remove controls, plus a tone picker. There is
no separate `BeatTool`.

## Astro / MDX

```mdx
<Scrolly tone="sky">
  <Beat stage="Chunk" sub="step 1">Split each document into pieces.</Beat>
  <Beat stage="Embed" sub="step 2">Turn every chunk into a vector.</Beat>
  <Beat stage="Write" sub="step 3">Store it under a stable id.</Beat>
</Scrolly>
```

## Notes

- The pin/swap behavior needs real scroll height, so it only activates at
  wider viewports (via a CSS container query) and when JavaScript runs —
  both fallbacks render the same content, just not pinned.
