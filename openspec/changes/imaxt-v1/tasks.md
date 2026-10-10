# Tasks

## 1. Workspace setup (done)

- [x] 1.1 Bun workspace root configured (package.json workspaces, tsconfig.base.json, biome.json, bunfig.toml + happy-dom preload, LICENSE, README, .changeset/config.json, CI + release GitHub Actions) - verified by `bun install`, `bun run lint`, `bun run typecheck`, `bun run build` all exiting 0 with placeholder packages
- [x] 1.2 Four packages scaffolded (`packages/{core,editorjs,mdx,astro}`) with package.json metadata (name, license, repository, exports, publishConfig) and tsconfig - verified by the same commands resolving all four workspace packages

## 2. core: shared tokens and motion-reduction utility

- [ ] 2.1 Write failing tests for a `tone` type/validator (exactly mint/lilac/sky/rose/accent/ink, default ink) and a `prefersReducedMotion()` helper, then implement both until tests pass - verify with `bun test packages/core/src/shared`

## 3. core: Statement, PullQuote, Sidenote

- [ ] 3.1 Write failing tests for `renderStatement`, `renderPullQuote`, `renderSidenote` (per block-render-engine spec scenarios: emphasis markup, attribution, label), then implement until tests pass - verify with `bun test packages/core`

## 4. core: Stat and StatRow

- [ ] 4.1 Write failing tests for `renderStat` (numeric vs non-numeric value, final value always present as text) and `renderStatRow`, then implement, then implement the `attachStatCountUp` interactivity (count-up once on first intersection, reduced-motion skips animation) with its own tests - verify with `bun test packages/core`

## 5. core: Compare and Side

- [ ] 5.1 Write failing tests for `renderCompare`/`renderSide` (exactly two sides, before/after kind, narrow-viewport stacking expressed via CSS class/attribute the test can assert on), then implement - verify with `bun test packages/core`

## 6. core: Steps and Step

- [ ] 6.1 Write failing tests for `renderSteps`/`renderStep` (document-order numbering), then implement - verify with `bun test packages/core`

## 7. core: Timeline and Event

- [ ] 7.1 Write failing tests for `renderTimeline`/`renderEvent` (order preservation), then implement - verify with `bun test packages/core`

## 8. core: Bars

- [ ] 8.1 Write failing tests for `renderBars` (bar width proportional to max, every value/label present as text), then implement - verify with `bun test packages/core`

## 9. core: CodeWalk

- [ ] 9.1 Write failing tests for `renderCodeWalk` (all lines/steps visible with no JS), then implement - verify with `bun test packages/core`

## 10. core: Marquee

- [ ] 10.1 Write failing tests for `renderMarquee` and its reduced-motion behavior (static when `prefers-reduced-motion: reduce`), then implement - verify with `bun test packages/core`

## 11. core: Heatmap

- [ ] 11.1 Write failing tests for `renderHeatmap` (cell value always rendered as text alongside the tint, rows/cols/data dimension matching), then implement - verify with `bun test packages/core`

## 12. core: CurvedText

- [ ] 12.1 Write failing tests for `renderCurvedText` (text stays selectable for every shape, `decorative` excluded from accessibility tree, spin stops under reduced motion), then implement - verify with `bun test packages/core`

## 13. core: Scrolly and Beat

- [ ] 13.1 Write failing tests for `renderScrolly`/`renderBeat` (no-JS/narrow-viewport fallback renders each Beat's own stage/sub inline) and the `attachScrolly` pin/swap interactivity, then implement - verify with `bun test packages/core`

## 14. core: TypeLab (vanilla port)

- [ ] 14.1 Write failing tests for `renderTypeLab` (sample text present, family scoping) and `attachTypeLab` (axis controls manipulate rendered sample), porting the behavior of the source repo's React `TypeLab.tsx`/`TypeLab.astro` to vanilla TS with no framework dependency, then implement - verify with `bun test packages/core`

## 15. core: ImaxtCover

- [ ] 15.1 Write failing tests for `renderImaxtCover` (word/stat/quote/stack kinds, stack-from-title fallback, aspect ratio prop), then implement - verify with `bun test packages/core`

## 16. core: styles and package finalization

- [ ] 16.1 Port `imaxt.css`'s tone tokens and per-block styles into `packages/core/src/styles.css`, replacing the placeholder - verify every render function's test suite still passes with real class names wired to real CSS selectors (`bun test packages/core`)
- [ ] 16.2 Run `bun run --filter=@inflate-ai/imaxt-core build` and `typecheck` and fix any error - verify both exit 0 and `dist/index.js`, `dist/index.d.ts`, `dist/styles.css` exist

## 17. editorjs: shared base

- [ ] 17.1 Write failing tests for a shared tone-picker settings mixin (offers exactly the six tones) and shared toolbox-icon helpers, then implement - verify with `bun test packages/editorjs`

## 18. editorjs: standalone tools

- [ ] 18.1 Write failing tests for the Statement, PullQuote, Sidenote, CurvedText, Marquee, Heatmap, and Bars tools (toolbox entry present, `render()` preview matches the matching `core` render function's output for given data, `save()` output is JSON-round-trippable, `validate()` rejects missing required fields), then implement each tool - verify with `bun test packages/editorjs`
- [ ] 18.2 Write failing tests for the TypeLab tool (wraps `core`'s `renderTypeLab`/`attachTypeLab`), then implement - verify with `bun test packages/editorjs`

## 19. editorjs: composite tools

- [ ] 19.1 Write failing tests for the StatRow, Steps, Timeline, and Scrolly tools (add/remove child entries update both the internal list and `save()` output, in order), then implement each - verify with `bun test packages/editorjs`
- [ ] 19.2 Write failing tests for the Compare tool (always exactly two sides, no add/remove past two) and the CodeWalk tool (steps list plus a code-sample field), then implement both - verify with `bun test packages/editorjs`

## 20. editorjs: package finalization

- [ ] 20.1 Write a test asserting ImaxtCover is not registered among the exported tools, then confirm it passes
- [ ] 20.2 Run `bun run --filter=@inflate-ai/imaxt-editorjs build` and `typecheck` and fix any error - verify both exit 0

## 21. mdx: frontmatter and ImaxtCover

- [ ] 21.1 Write failing tests for parsing and stringifying YAML frontmatter (including the `cover` key for ImaxtCover data) independent of the body, then implement - verify with `bun test packages/mdx`

## 22. mdx: standalone block compile and parse

- [ ] 22.1 Write failing tests for `blocksToMdx`/`mdxToBlocks` on every standalone block (Statement, PullQuote, Sidenote, Bars, Marquee, Heatmap, CurvedText, TypeLab) asserting exact existing JSX syntax on compile and lossless round-trip on parse, then implement - verify with `bun test packages/mdx`

## 23. mdx: composite block compile and parse

- [ ] 23.1 Write failing tests for `blocksToMdx`/`mdxToBlocks` on every composite block pair (StatRow/Stat, Compare/Side, Steps/Step, Timeline/Event, Scrolly/Beat, CodeWalk) asserting nested-element output and lossless round-trip, then implement - verify with `bun test packages/mdx`

## 24. mdx: unrecognized content passthrough

- [ ] 24.1 Write failing tests asserting plain prose and non-Imaxt JSX between recognized blocks survive a parse→compile round-trip unchanged, then implement the generic `markdown` passthrough block type - verify with `bun test packages/mdx`

## 25. mdx: golden fixtures and package finalization

- [ ] 25.1 Write golden-fixture tests using representative hand-written-style `.mdx` strings covering every block at least once, asserting `mdxToBlocks` then `blocksToMdx` reproduces the original source - verify with `bun test packages/mdx`
- [ ] 25.2 Run `bun run --filter=@inflate-ai/imaxt-mdx build` and `typecheck` and fix any error - verify both exit 0

## 26. astro: standalone components

- [ ] 26.1 Implement thin `.astro` wrappers for Statement, PullQuote, Sidenote, Bars, Marquee, Heatmap, CurvedText that call the matching `core` render function via `set:html` - verify with an Astro Container API test per component asserting its output matches `core`'s direct output for the same props (`bun test packages/astro`)

## 27. astro: composite components

- [ ] 27.1 Implement `.astro` wrappers for StatRow/Stat, Compare/Side, Steps/Step, Timeline/Event, Scrolly/Beat accepting children via the default slot - verify with Container API tests asserting nested children render in order (`bun test packages/astro`)
- [ ] 27.2 Implement the CodeWalk `.astro` wrapper (wraps a code-sample child plus a steps prop) - verify with a Container API test

## 28. astro: ImaxtCover, TypeLab island, and convenience import

- [ ] 28.1 Implement the ImaxtCover `.astro` component and the TypeLab `.astro` island (`client:visible`, calling `core`'s vanilla `attachTypeLab`) - verify with Container API tests, including one asserting TypeLab's script only attaches behavior, never hydrates a framework
- [ ] 28.2 Implement `src/index.ts`'s `imaxt` convenience object exporting every standalone and composite-parent component by name - verify with a test importing it and asserting every expected key is present and is the right component

## 29. astro: package finalization

- [ ] 29.1 Run `astro check` against the package and fix any error - verify it reports zero errors
- [ ] 29.2 Run `bun run --filter=@inflate-ai/imaxt-astro build` and `typecheck` - verify both exit 0

## 30. Workspace-wide validation

- [ ] 30.1 Run `bun run lint`, `bun run typecheck`, `bun test`, and `bun run build` from the repo root - verify every one exits 0 across all four packages
- [ ] 30.2 Re-run `npm view <pkg> version` for every pinned dependency and confirm each package.json still matches the latest stable version available (re-pin and re-test if any has moved) - verify by diffing the recorded versions against fresh `npm view` output
- [ ] 30.3 Review all four `package.json` files for npm-publish readiness (name, version, license, repository, exports, files, publishConfig.access) - verify with `npm pack --dry-run` in each package directory producing no unexpected files and no errors

## Workflow follow-up

- Commit and push this change's implementation to `ccr-11238ad0-go18z6`.
- Archive this change once the user has reviewed the implementation.
- Actually publishing to npm and making the GitHub repo public are account-level actions outside this change's access - left to the user.
