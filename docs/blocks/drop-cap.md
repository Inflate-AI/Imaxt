# DropCap

An oversized opening letter for a paragraph's first character - the
full text content (including that letter) stays in normal reading
order; only the styling distinguishes it.

## Data shape

```ts
interface DropCapData {
  html: string;    // expected to start with plain text, e.g. the opening of a sentence
  tone?: string;    // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`DropCapTool` is a rich-text body field plus a tone picker, like
`Sidenote`.

## Astro / MDX

```mdx
<DropCap>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</DropCap>
```
