# @inflate-ai/imaxt-editor

## 0.2.0

### Minor Changes

- c3e0f67: Production-readiness pass on the editor and its tone system:
  
  - `imaxt-core`: preset tones (mint/lilac/sky/rose) now get real dark-mode colors instead of the light pastel swatch with swapped text, which made text unreadable in dark mode on Statement, StatRow, Scorecard, Banner, Marquee, and CurvedText. Dark mode now applies both by OS preference and by an explicit `data-theme="dark"` attribute. Adds `toneAttrs`/`isCustomTone`/`autoOnColor` so any tone field can also take a literal `#rrggbb` custom color with an automatically contrast-safe text color. Delta is visually redesigned (a tone-colored chip with a directional badge) instead of plain unstyled text.
  - `imaxt-editor`: fixes the slash menu silently dropping multi-word searches ("type lab", "pull quote", ...) and leaving the typed text behind as dead paragraph text. Fixes TypeLab (and Ticker/Scrolly/CodeWalk/StatRow) rendering inert in both the live block preview and Render mode by wiring up their client-side behavior after render, the same way a published page does. Render mode now reuses the exact same classed markup as the Write mode's own contentEditable, so the two are pixel-identical - the only difference is editability. Raw mode is now a full-page view instead of a boxed textarea. `ImaxtEditorTheme` gains `toneMint`/`toneLilac`/`toneSky`/`toneRose`/`onTone` so a consumer's `theme` prop can carry correct per-scheme tone colors. The block editor's tone field is now a swatch picker with a custom-color option instead of a plain preset dropdown.
- 57dfd57: Add `@inflate-ai/imaxt-editor`, a Medium-style Markdown/MDX editor built on Lexical: full standard Markdown editing (headings, lists, tables, checklists, quotes, code, links, images) with every Imaxt block reachable from the same `/` insert menu on the same document, a configurable theme (reading the same CSS tokens `imaxt-core`/Blog already use), and a pluggable `ImageStorageAdapter` for image uploads (defaults to in-memory, no backend required).
- f8af798: Adds a `Mermaid` block (`renderMermaid`/`attachMermaid` in `imaxt-core`, a `<Mermaid>` component in `imaxt-mdx`'s compiler and `imaxt-astro`, reachable from the editor's slash menu under Technical) - a real diagram rendered client-side with the `mermaid` library, themed from Imaxt's own tone tokens so it matches light/dark/custom themes automatically, lazily loaded so it costs nothing until a diagram is actually on the page.
  
  Fixes a real, systemic layout bug: Bars, Steps, Timeline, Ranked, Funnel, Sidenote, Callout, PullQuote, and Stat all had their core layout CSS (list-style reset, grid, background, padding) gated behind a `.prose` ancestor class that only Blog's own article wrapper provides - so every one of them rendered with broken or missing spacing inside the editor (both the live block preview and Render mode), which Blog's own layout happened to mask. That gate is removed; the same blocks keep their existing non-`.prose` ancestry.
  
  Fixes a real data-loss bug in `imaxt-mdx`'s JS-literal parser used for expression-attribute props (e.g. an array of chart items): it only handled an escaped quote or backslash, silently mangling any other backslash escape sequence (`\n`, `\t`, ...) instead of interpreting it, so a string value containing one of those would round-trip corrupted.
  
  Raw mode now grows to fit its content and lets the page scroll, instead of scrolling inside its own fixed-height box like a form input - matching Write and Render mode.
  
  The editor demo's sample article is rewritten from a self-referential "look what we built" piece into actual documentation of what Imaxt is, its six block categories, the tone system, and how to use the editor - typeset using Imaxt's own blocks throughout, including the new Mermaid block for a real architecture diagram.
- 1c5b9ee: Redesigns the slash (`/`) insert menu and fixes two real bugs in it:
  
  - The menu was never actually anchored near the caret - `menuRenderFn` returned plain JSX instead of portaling into Lexical's positioned anchor element, so it silently rendered at the very end of the document's DOM flow instead of floating under the cursor. Fixed by portaling into the same floating-UI anchor the toolbar and drag handle already use (so it also correctly inherits the editor's theme colors in both light and dark mode).
  - Typing just "/" showed only the first 12 options (flat-sliced before grouping), hiding nearly all 40 Imaxt blocks until you typed enough of a name to filter down to them. The menu now shows every block, always - it already scrolls.
  
  The menu itself is redesigned: every Imaxt block is grouped into a category (Typography, Data & Stats, Narrative, Technical, Visual & Motion, Media) instead of one flat 40-item list, each with a colored icon tile (reusing the same tone palette as the blocks themselves) and a short description for the Markdown basics. Filtering also matches category names. Added a "no blocks match" empty state for an unmatched query.

### Patch Changes

- Updated dependencies [c3e0f67]
- Updated dependencies [57dfd57]
- Updated dependencies [f8af798]
  - @inflate-ai/imaxt-core@1.1.0
  - @inflate-ai/imaxt-mdx@1.1.0
