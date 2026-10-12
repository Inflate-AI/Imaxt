---
"@inflate-ai/imaxt-core": minor
"@inflate-ai/imaxt-editor": minor
---

Production-readiness pass on the editor and its tone system:

- `imaxt-core`: preset tones (mint/lilac/sky/rose) now get real dark-mode colors instead of the light pastel swatch with swapped text, which made text unreadable in dark mode on Statement, StatRow, Scorecard, Banner, Marquee, and CurvedText. Dark mode now applies both by OS preference and by an explicit `data-theme="dark"` attribute. Adds `toneAttrs`/`isCustomTone`/`autoOnColor` so any tone field can also take a literal `#rrggbb` custom color with an automatically contrast-safe text color. Delta is visually redesigned (a tone-colored chip with a directional badge) instead of plain unstyled text.
- `imaxt-editor`: fixes the slash menu silently dropping multi-word searches ("type lab", "pull quote", ...) and leaving the typed text behind as dead paragraph text. Fixes TypeLab (and Ticker/Scrolly/CodeWalk/StatRow) rendering inert in both the live block preview and Render mode by wiring up their client-side behavior after render, the same way a published page does. Render mode now reuses the exact same classed markup as the Write mode's own contentEditable, so the two are pixel-identical - the only difference is editability. Raw mode is now a full-page view instead of a boxed textarea. `ImaxtEditorTheme` gains `toneMint`/`toneLilac`/`toneSky`/`toneRose`/`onTone` so a consumer's `theme` prop can carry correct per-scheme tone colors. The block editor's tone field is now a swatch picker with a custom-color option instead of a plain preset dropdown.
