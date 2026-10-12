# Embed

A styled link card pointing at an external URL (a video, a tweet, a
talk). Renders as a plain link, never a live-embedded `<iframe>` or
widget - keeping published content free of third-party scripts and
trackers.

## Data shape

```ts
interface EmbedData {
  url: string;
  caption?: string;
}
```

## EditorJS

`EmbedTool` is a simple field-based tool: one text input for `url`,
one for `caption`. No tone picker.

## Astro / MDX

```mdx
<Embed url="https://example.com/talk" caption="Watch the full talk" />
```
