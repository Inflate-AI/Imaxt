---
"@inflate-ai/imaxt-mdx": minor
"@inflate-ai/imaxt-core": minor
"@inflate-ai/imaxt-editorjs": minor
"@inflate-ai/imaxt-astro": minor
---

Add GFM support (tables, task lists, strikethrough, autolinks) to `imaxt-mdx`'s MDX parsing and serialization, and a new `Embed` block (a link card for external URLs, with an optional caption) across `imaxt-core`, `imaxt-editorjs`, `imaxt-astro`, and `imaxt-mdx`'s compiler. Also exports `blockToMdastNode`/`mdastNodeToBlock` from `imaxt-mdx` for converting a single block without a document wrapper.
