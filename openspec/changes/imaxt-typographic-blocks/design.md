# Design

## Redacted needs no client JS either

Like `Faq`/`Footnote`, `Redacted` uses a native `<details>` whose
`<summary>` is styled as a solid redaction bar (no visible disclosure
text) - clicking or keyboard-activating it reveals the hidden `html`
body. This brings the running total of zero-client-JS blocks in this
v1.0.0 push to 21 of 26 (one more than originally estimated).

## Ticker's no-JS/reduced-motion fallback

`renderTicker` renders every phrase in the DOM as a list item; `attachTicker`
(skipped entirely under `prefers-reduced-motion: reduce`, and never run
at all without client JS) hides all but one at a time and swaps on an
interval. This means the no-JS state is simply "every phrase visible",
not a degraded or different rendering - the same no-JS/no-motion
guarantee `Marquee` and `Scrolly` already give.

## DropCap's first-letter split

`renderDropCap` expects its `html` body to start with plain text (the
overwhelmingly common case for a paragraph's opening sentence) and wraps
just that first character in its own span for the oversized drop-cap
styling; the remaining text follows immediately after in the same
paragraph, so the full text content reads identically whether or not the
styling is visually honored.

## Data shapes

```ts
interface TickerData { phrases: string[]; seconds?: number; tone?: string }

interface DropCapData { html: string; tone?: string }

interface RedactedData { html: string; revealLabel?: string }

interface StampData { text: string; angle?: number; tone?: string }

interface BannerData { text: string; tone?: string }
```
