# Design

## Why standalone, not composite

`StatRow`/`Compare`/`Steps`/`Timeline`/`Scrolly`/`CodeWalk` are composite
because each child entry carries free-form rich-text body content that needs
its own editable surface. None of these seven blocks need that: every entry
is a label plus a small number of scalar fields (a number, a short string).
That's exactly the shape `Bars` (`items: { label, value }[]`) and `Heatmap`
(`rows`/`cols`/`data` grids) already use as plain arrays inside one data
object, with one EditorJS tool managing the array via the existing
`createRepeatableList` helper (already shared by the composite tools; nothing
new needed there either since it's generic over `T`).

Keeping all seven standalone means:
- One `render*` function per block, pure and framework-agnostic, same as
  `renderBars`.
- One non-composite EditorJS tool per block, built on the same
  `createRepeatableList` + `createTonePicker` helpers already in
  `packages/editorjs/src/shared.ts`.
- One Astro component per block wrapping its render function directly
  (`Omit<XData, never>` props, no slots).
- One `jsxElement('X', [...attrs incl. exprAttr('items', ...)])` compiler
  mapping, same pattern as `Bars`/`Heatmap`/`Marquee` in `to-mdx.ts`, and the
  mirrored `getExprAttr` reads in `from-mdx.ts`.

## Data shapes

```ts
interface RankedItem { label: string; value?: string; delta?: number | 'new' | 'same' }
interface RankedData { items: RankedItem[]; unit?: string; tone?: string }

type MatrixCell = 'yes' | 'no' | 'partial' | string;
interface MatrixData { rows: string[]; cols: string[]; cells: MatrixCell[][]; caption?: string }

interface DeltaData { label: string; from: string | number; to: string | number; unit?: string; tone?: string }

interface GaugeData { value: number; max: number; label?: string; unit?: string; tone?: string }

interface ScorecardItem { label: string; value: string | number; unit?: string; delta?: string }
interface ScorecardData { items: ScorecardItem[]; tone?: string }

interface SparklineData { values: number[]; label?: string }

interface FunnelStage { label: string; value: number }
interface FunnelData { stages: FunnelStage[]; unit?: string; tone?: string }
```

## Rendering notes

- **Ranked**: ordered list (`<ol class="imx-ranked">`), position is the rank;
  `delta` renders as a small ▲/▼/– badge plus the numeric change as real text
  (never color-only), `'new'` renders a "NEW" badge.
- **Matrix**: a real `<table>`; each cell renders its text content (`yes`/
  `no`/`partial` get a glyph + the word, not just a color), `validate()`
  rejects a `cells` grid whose dimensions don't match `rows`/`cols` (mirrors
  the existing Heatmap validation example named in `editorjs-authoring`).
- **Delta**: `from`/`to` plus a computed direction when both are numeric
  (`to > from` → up, etc.); non-numeric values skip the arrow, same
  non-numeric-skips-animation precedent as `Stat`.
- **Gauge**: proportional fill (`value/max`), the numeric value always
  present as text content, same precedent as `Bars`' width-vs-text rule.
- **Scorecard**: a dense grid of label/value/unit/delta entries, visually a
  smaller-scale sibling of `StatRow` but with no count-up animation and no
  nested children.
- **Sparkline**: inline SVG polyline sized for prose flow; `role="img"` with
  an `aria-label` summarizing the full value list (min/max/last), since a
  trend line's individual points are not independently meaningful the way a
  Bars/Heatmap value is.
- **Funnel**: stages render as bars whose width is proportional to the first
  stage's value, each with its value as text and a drop-off percentage
  against the previous stage.

All seven accept the shared `tone` token set and default to `ink`, per the
existing shared-tone requirement.
