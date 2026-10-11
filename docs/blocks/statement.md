# Statement

A short sentence at poster scale. Bold text gets a marker-style highlight;
italic text gets an expressive italic face.

## Data shape

```ts
interface StatementData {
  html: string;              // rich text: plain text, <strong>, <em>, <br>
  tone?: string;              // mint | lilac | sky | rose | accent | ink | white (default: ink)
  align?: 'left' | 'center';  // default: left
  wide?: boolean;
  bleed?: boolean;
}
```

## EditorJS

`StatementTool` — a contentEditable field for the text, block settings for
alignment and tone.

```ts
import { imaxtTools } from '@inflate-ai/imaxt-editorjs';
new EditorJS({ tools: { statement: imaxtTools.statement } });
```

## Astro / MDX

```mdx
<Statement tone="mint" align="center">
  Every retrieval project rebuilds the **same plumbing**.
</Statement>
```

```astro
---
import { Statement } from '@inflate-ai/imaxt-astro';
---
<Statement tone="mint">Boring is <em>dependable</em>.</Statement>
```

## Notes

- Scroll-driven entrance animation (`animation-timeline: view()`) only
  applies where the browser supports it, and never under
  `prefers-reduced-motion: reduce`.
