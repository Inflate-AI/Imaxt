# PullQuote

A block quotation with an optional attribution.

## Data shape

```ts
interface PullQuoteData {
  html: string;   // the quoted text (plain, <strong>, <em>, <br>)
  by?: string;     // attribution, plain text
  wide?: boolean;
}
```

## EditorJS

`PullQuoteTool` — a contentEditable field for the quote, a plain input for
the attribution.

## Astro / MDX

```mdx
<PullQuote by="Design rule">The best API is the one you can describe in a single paragraph.</PullQuote>
```

```astro
---
import { PullQuote } from '@inflate-ai/imaxt-astro';
---
<PullQuote by="Someone">Quoted text</PullQuote>
```
