---
"@inflate-ai/imaxt-core": patch
---

Restore the `white` tone, dropped from the exported `TONES`/`Tone` type during the original extraction even though its `[data-tone="white"]` CSS rule was carried over - `resolveTone('white')` was silently falling back to `'ink'`.
