# Sidenote

A labelled aside, visually distinguished from the surrounding body text.

## Data shape

```ts
interface SidenoteData {
  html: string;    // the note's body (plain, <strong>, <em>, <br>)
  label?: string;   // default: "Note"
}
```

## EditorJS

`SidenoteTool` — a plain input for the label, a contentEditable field for
the body.

## Astro / MDX

```mdx
<Sidenote label="Mock data">Numbers here are placeholders.</Sidenote>
```

```astro
---
import { Sidenote } from '@inflate-ai/imaxt-astro';
---
<Sidenote>Defaults to the "Note" label when none is given.</Sidenote>
```
