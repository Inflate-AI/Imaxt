---
"@inflate-ai/imaxt-core": patch
"@inflate-ai/imaxt-astro": patch
---

`CodeWalk` now accepts pre-rendered code markup - a `html` field on `CodeWalkData`, or (in `@inflate-ai/imaxt-astro`) a default slot - used in place of the plain-text rendering of `code`. `code` stays required: it's still the canonical, editable value for `@inflate-ai/imaxt-editorjs`. This lets an Astro/MDX consumer pass syntax-highlighted markup (e.g. from Astro's own `<Code>`) while `attachCodeWalk`'s line-dimming still works unchanged, since it only looks for `.line` elements regardless of their origin.
