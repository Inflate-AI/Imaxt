# Footnote

A self-contained reference marker and definition, revealed via native
`<details>`/`<summary>` - no client-side JavaScript required. Unlike a
traditional document-wide numbered footnote list, each `Footnote` is
independent: place it where the annotation belongs and give it its own
`marker` (defaulting to `*`).

## Data shape

```ts
interface FootnoteData {
  marker?: string;   // default: "*"
  html: string;
}
```

## EditorJS

`FootnoteTool` is a simple field-based tool: a marker input and a
rich-text body, like `Sidenote`.

## Astro / MDX

```mdx
<Footnote marker="1">
  Measured on a cold cache; warm-cache latency is roughly 40% lower.
</Footnote>
```
