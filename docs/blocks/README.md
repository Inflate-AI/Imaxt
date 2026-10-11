# Block reference

Each row is one `packages/core/src/*.ts` module. A composite block's
children (`Stat`, `Side`, `Step`, `Event`, `Beat`) don't get their own
EditorJS tool — their parent tool manages them as a repeatable internal
list — but they are real, separate Astro components, nested via `<slot />`
just like any other parent/child composition in MDX or Astro.

| Block | Core module | EditorJS tool | Astro component(s) |
|---|---|---|---|
| [Statement](./statement.md) | `statement.ts` | `StatementTool` | `Statement` |
| [PullQuote](./pull-quote.md) | `pull-quote.ts` | `PullQuoteTool` | `PullQuote` |
| [Sidenote](./sidenote.md) | `sidenote.ts` | `SidenoteTool` | `Sidenote` |
| [Stat / StatRow](./stat.md) | `stat.ts` | `StatRowTool` (composite) | `StatRow`, `Stat` |
| [Compare / Side](./compare.md) | `compare.ts` | `CompareTool` (composite) | `Compare`, `Side` |
| [Steps / Step](./steps.md) | `steps.ts` | `StepsTool` (composite) | `Steps`, `Step` |
| [Timeline / Event](./timeline.md) | `timeline.ts` | `TimelineTool` (composite) | `Timeline`, `Event` |
| [Bars](./bars.md) | `bars.ts` | `BarsTool` | `Bars` |
| [Ranked](./ranked.md) | `ranked.ts` | `RankedTool` | `Ranked` |
| [Matrix](./matrix.md) | `matrix.ts` | `MatrixTool` | `Matrix` |
| [Delta](./delta.md) | `delta.ts` | `DeltaTool` | `Delta` |
| [Gauge](./gauge.md) | `gauge.ts` | `GaugeTool` | `Gauge` |
| [Scorecard](./scorecard.md) | `scorecard.ts` | `ScorecardTool` | `Scorecard` |
| [Sparkline](./sparkline.md) | `sparkline.ts` | `SparklineTool` | `Sparkline` |
| [Funnel](./funnel.md) | `funnel.ts` | `FunnelTool` | `Funnel` |
| [Callout](./callout.md) | `callout.ts` | `CalloutTool` | `Callout` |
| [Faq](./faq.md) | `faq.ts` | `FaqTool` | `Faq` |
| [Takeaways](./takeaways.md) | `takeaways.ts` | `TakeawaysTool` | `Takeaways` |
| [Footnote](./footnote.md) | `footnote.ts` | `FootnoteTool` | `Footnote` |
| [Glossary](./glossary.md) | `glossary.ts` | `GlossaryTool` | `Glossary` |
| [Versus](./versus.md) | `versus.ts` | `VersusTool` | `Versus` |
| [Checklist](./checklist.md) | `checklist.ts` | `ChecklistTool` | `Checklist` |
| [Terminal](./terminal.md) | `terminal.ts` | `TerminalTool` | `Terminal` |
| [Diff](./diff.md) | `diff.ts` | `DiffTool` | `Diff` |
| [FileTree](./file-tree.md) | `file-tree.ts` | `FileTreeTool` | `FileTree` |
| [ErrorBox](./error-box.md) | `error-box.ts` | `ErrorBoxTool` | `ErrorBox` |
| [Changelog](./changelog.md) | `changelog.ts` | `ChangelogTool` | `Changelog` |
| [Formula](./formula.md) | `formula.ts` | `FormulaTool` | `Formula` |
| [CodeWalk](./code-walk.md) | `code-walk.ts` | `CodeWalkTool` (composite) | `CodeWalk` |
| [Marquee](./marquee.md) | `marquee.ts` | `MarqueeTool` | `Marquee` |
| [Heatmap](./heatmap.md) | `heatmap.ts` | `HeatmapTool` | `Heatmap` |
| [CurvedText](./curved-text.md) | `curved-text.ts` | `CurvedTextTool` | `CurvedText` |
| [Scrolly / Beat](./scrolly.md) | `scrolly.ts` | `ScrollyTool` (composite) | `Scrolly`, `Beat` |
| [TypeLab](./type-lab.md) | `type-lab.ts` | `TypeLabTool` | `TypeLab` |
| [ImaxtCover](./imaxt-cover.md) | `imaxt-cover.ts` | *(none — post-level, not a body block)* | `ImaxtCover` |

## Adding a new block

1. Add the render function (+ `attach*` if it needs interactivity) to
   `packages/core`, test-first.
2. Add its EditorJS tool to `packages/editorjs` and its Astro component(s)
   to `packages/astro`, both test-first.
3. Add its compile/parse pair to `packages/mdx`'s `to-mdx.ts`/`from-mdx.ts`.
4. Add one page here, following the existing pages' structure (data shape,
   EditorJS usage, Astro/MDX usage, notes), and one row to the table above.

Nothing else under `docs/` needs to change.
