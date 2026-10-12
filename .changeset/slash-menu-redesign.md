---
"@inflate-ai/imaxt-editor": minor
---

Redesigns the slash (`/`) insert menu and fixes two real bugs in it:

- The menu was never actually anchored near the caret - `menuRenderFn` returned plain JSX instead of portaling into Lexical's positioned anchor element, so it silently rendered at the very end of the document's DOM flow instead of floating under the cursor. Fixed by portaling into the same floating-UI anchor the toolbar and drag handle already use (so it also correctly inherits the editor's theme colors in both light and dark mode).
- Typing just "/" showed only the first 12 options (flat-sliced before grouping), hiding nearly all 40 Imaxt blocks until you typed enough of a name to filter down to them. The menu now shows every block, always - it already scrolls.

The menu itself is redesigned: every Imaxt block is grouped into a category (Typography, Data & Stats, Narrative, Technical, Visual & Motion, Media) instead of one flat 40-item list, each with a colored icon tile (reusing the same tone palette as the blocks themselves) and a short description for the Markdown basics. Filtering also matches category names. Added a "no blocks match" empty state for an unmatched query.
