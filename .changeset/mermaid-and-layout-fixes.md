---
"@inflate-ai/imaxt-core": minor
"@inflate-ai/imaxt-mdx": minor
"@inflate-ai/imaxt-astro": minor
"@inflate-ai/imaxt-editor": minor
---

Adds a `Mermaid` block (`renderMermaid`/`attachMermaid` in `imaxt-core`, a `<Mermaid>` component in `imaxt-mdx`'s compiler and `imaxt-astro`, reachable from the editor's slash menu under Technical) - a real diagram rendered client-side with the `mermaid` library, themed from Imaxt's own tone tokens so it matches light/dark/custom themes automatically, lazily loaded so it costs nothing until a diagram is actually on the page.

Fixes a real, systemic layout bug: Bars, Steps, Timeline, Ranked, Funnel, Sidenote, Callout, PullQuote, and Stat all had their core layout CSS (list-style reset, grid, background, padding) gated behind a `.prose` ancestor class that only Blog's own article wrapper provides - so every one of them rendered with broken or missing spacing inside the editor (both the live block preview and Render mode), which Blog's own layout happened to mask. That gate is removed; the same blocks keep their existing non-`.prose` ancestry.

Fixes a real data-loss bug in `imaxt-mdx`'s JS-literal parser used for expression-attribute props (e.g. an array of chart items): it only handled an escaped quote or backslash, silently mangling any other backslash escape sequence (`\n`, `\t`, ...) instead of interpreting it, so a string value containing one of those would round-trip corrupted.

Raw mode now grows to fit its content and lets the page scroll, instead of scrolling inside its own fixed-height box like a form input - matching Write and Render mode.

The editor demo's sample article is rewritten from a self-referential "look what we built" piece into actual documentation of what Imaxt is, its six block categories, the tone system, and how to use the editor - typeset using Imaxt's own blocks throughout, including the new Mermaid block for a real architecture diagram.
