# Versus

A head-to-head framing of exactly two named things, as plain data (not
slotted children) - a lighter sibling of `Compare` for when neither side
needs rich nested content.

## Data shape

```ts
interface VersusSide {
  label: string;
  html: string;
}

interface VersusData {
  sides: [VersusSide, VersusSide];
  vsLabel?: string;   // default: "VS"
  tone?: string;      // mint | lilac | sky | rose | accent | ink | white (default: ink)
}
```

## EditorJS

`VersusTool` manages two fixed side fields (never fewer or more) plus a
`vsLabel` input and a tone picker.

## Astro / MDX

```mdx
<Versus sides={[
  { label: "Postgres", html: "Relational, battle-tested, one more service to run." },
  { label: "SQLite", html: "Embedded, zero-ops, scales to one writer." },
]} />
```
