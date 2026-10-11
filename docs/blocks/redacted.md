# Redacted

Body content hidden behind a solid redaction bar, revealed via a native
`<details>`/`<summary>` element - no client-side JavaScript required.

## Data shape

```ts
interface RedactedData {
  html: string;
  revealLabel?: string;   // accessible name for the redaction bar; default: "Reveal"
}
```

## EditorJS

`RedactedTool` is a reveal-label field plus a rich-text body, like
`Sidenote`.

## Astro / MDX

```mdx
<Redacted revealLabel="Reveal the launch date">
  The launch date is March 3rd.
</Redacted>
```
