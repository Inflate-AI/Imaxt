# Banner

A static oversized word or short phrase, used as a section break - the
non-scrolling sibling of `Marquee`.

## Data shape

```ts
interface BannerData {
  text: string;
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`BannerTool` is a simple field-based tool: text plus a tone picker.

## Astro / MDX

```mdx
<Banner text="Launching soon" tone="accent" />
```
