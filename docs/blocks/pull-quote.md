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

## Render

```ts
import { renderPullQuote } from '@inflate-ai/imaxt/core';

renderPullQuote({ html: 'Quoted text', by: 'Someone' });
```
