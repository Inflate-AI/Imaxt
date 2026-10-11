# block-render-engine Specification

## Purpose

Defines the framework-agnostic contract for how every Imaxt block renders to HTML,
which design tokens it accepts, and how its client-side interactivity behaves,
independent of any consuming framework (EditorJS, Astro, or otherwise).

## Requirements

### Requirement: Shared tone tokens and reduced motion
Every block that accepts a `tone` renders one of exactly `mint`, `lilac`, `sky`,
`rose`, `accent`, `ink`, `white`, defaulting to `ink` when omitted. Any block with
animation (count-up, spin, scroll-linked swap, marquee scroll) SHALL render its
final, settled state with no animation when the environment signals
`prefers-reduced-motion: reduce`.

#### Scenario: Unspecified tone falls back to ink
- **WHEN** a block that accepts `tone` is rendered without a `tone` value
- **THEN** it renders with the `ink` tone applied

#### Scenario: Reduced motion disables animation
- **WHEN** a block with animated behavior is attached in an environment with
  `prefers-reduced-motion: reduce`
- **THEN** it renders its final state immediately with no transition or motion

### Requirement: Statement block
Statement SHALL render a short sentence at poster scale. `**bold**`-equivalent
emphasis renders with a marker-style highlight and italic-equivalent emphasis
renders in an expressive italic face. It accepts an optional `tone` and an
optional text `align` of `left` or `center`.

#### Scenario: Statement with emphasis
- **WHEN** Statement is rendered with bold and italic inline content
- **THEN** the bold portion renders with the marker highlight and the italic
  portion renders in the expressive italic face

### Requirement: Stat and StatRow blocks
A Stat renders a single large numeral or short value with a unit and a label,
and an optional `tone`. A StatRow lays out a row of Stat entries. When a Stat's
`value` is purely numeric, it SHALL count up from zero to the final value once
when it first scrolls into view, and the rendered HTML always contains the
final value as real text regardless of animation state.

#### Scenario: Numeric stat value is present in markup before animation runs
- **WHEN** a Stat with a numeric `value` is rendered server-side (no client JS
  executed)
- **THEN** the final numeric value appears as text content in the output

#### Scenario: Non-numeric stat value is not animated
- **WHEN** a Stat's `value` is not purely numeric (e.g. "10×")
- **THEN** it renders as static text with no count-up behavior attached

### Requirement: PullQuote block
PullQuote SHALL render a block quotation with an optional attribution (`by`).

#### Scenario: PullQuote with attribution
- **WHEN** PullQuote is rendered with a `by` value
- **THEN** the attribution renders visibly associated with the quoted text

### Requirement: Compare and Side blocks
Compare SHALL render exactly two Side entries side by side on wide viewports and
stacked on narrow viewports. Each Side has a `label` and a `kind` of `before`
or `after` (defaulting to `after`), used to visually distinguish the two sides.

#### Scenario: Compare stacks on narrow viewports
- **WHEN** Compare is rendered at a narrow viewport width
- **THEN** its two Side entries render stacked vertically instead of side by
  side

### Requirement: Steps and Step blocks
Steps SHALL render an ordered sequence of Step entries, each with a `title` and
body content, numbered in document order.

#### Scenario: Steps numbering follows document order
- **WHEN** Steps renders three Step children
- **THEN** each Step is numbered 1 through 3 in the order given

### Requirement: Timeline and Event blocks
Timeline SHALL render a chronological sequence of Event entries, each with a `date`
label, a `title`, and body content.

#### Scenario: Timeline event order is preserved
- **WHEN** Timeline renders Event children in a given order
- **THEN** the rendered sequence preserves that same order

### Requirement: Bars block
Bars SHALL render a ranking or comparison chart from an `items` array of
`{ label, value }` entries, an optional shared `unit`, an optional `max` (the
value representing a full-width bar), and an optional `tone`. Every value and
label renders as real, selectable text, not only as a visual bar width.

#### Scenario: Bar width reflects proportion of max
- **WHEN** Bars renders an item whose `value` equals half of `max`
- **THEN** that item's bar renders at half the width of an item at `max`

#### Scenario: Values are readable as text
- **WHEN** Bars renders its items
- **THEN** every item's numeric value is present as selectable text content,
  not only encoded in a visual width or color

### Requirement: Sidenote block
Sidenote SHALL render a labelled aside, with an optional `label` and body content,
visually distinguished from the surrounding body text.

#### Scenario: Sidenote with a label
- **WHEN** Sidenote is rendered with a `label` value
- **THEN** the label renders visibly attached to the note's body content

### Requirement: CodeWalk block
CodeWalk renders a code sample alongside a sequence of steps, each with a
`lines` reference (e.g. "1" or "2-3"), a `title`, and explanatory `text`. With
no client-side JavaScript, every line of the code sample SHALL remain visible
and every step's explanation SHALL remain visible. A consumer MAY supply
pre-rendered code markup (e.g. syntax-highlighted HTML) in place of the
plain-text rendering of `code`; `code` stays the canonical, editable value
regardless.

#### Scenario: CodeWalk without JavaScript
- **WHEN** CodeWalk is rendered and no client-side JavaScript executes
- **THEN** the full code sample and every step's title and text are visible

#### Scenario: Pre-rendered code markup replaces the plain-text rendering
- **WHEN** CodeWalk is given pre-rendered code markup in place of plain-text
  `code`
- **THEN** the rendered output uses that markup instead of a plain-text
  rendering of `code`, while `code` remains available as the canonical value

### Requirement: Marquee block
Marquee renders a horizontally scrolling band built from a `words` array and
an optional `tone`, used as a section break. It SHALL be static (no scrolling
motion) when `prefers-reduced-motion: reduce` is signalled.

#### Scenario: Marquee words render as text
- **WHEN** Marquee is rendered with a `words` array
- **THEN** every word is present as real text content in the output

### Requirement: Heatmap block
Heatmap renders a real table whose cells are visually tinted according to
their value, scaled between a `min` and `max`, with `rows` and `cols` labels
and an optional `caption`. Every cell's numeric value SHALL always render as
visible text in that cell, never relying on color alone to convey the value.

#### Scenario: Cell value is never color-only
- **WHEN** Heatmap renders a cell with a given value
- **THEN** that value is printed as text inside the cell in addition to the
  color tint

### Requirement: CurvedText block
CurvedText renders text along an arc, wave, or ring `shape`, as real,
selectable text (not an image). A `circle` shape may carry a short `mark` and
may `spin` slowly; a `decorative` instance is excluded from the accessibility
tree. Spin SHALL stop when `prefers-reduced-motion: reduce` is signalled.

#### Scenario: CurvedText remains selectable text
- **WHEN** CurvedText is rendered with any `shape`
- **THEN** the given `text` is present as real, selectable text content

#### Scenario: Decorative CurvedText is hidden from assistive tech
- **WHEN** CurvedText is rendered with `decorative` set
- **THEN** its markup is excluded from the accessibility tree

### Requirement: Scrolly and Beat blocks
Scrolly SHALL render a statement pinned beside body content that swaps to match
each Beat (with a `stage` and `sub` label, plus body content) as it scrolls
into view, with an optional `tone`. Without client-side JavaScript, or at a
narrow viewport, each Beat instead renders its own stage/sub label inline with
its content.

#### Scenario: Scrolly without JavaScript or on narrow viewports
- **WHEN** Scrolly is rendered with no client-side JavaScript executing, or at
  a narrow viewport width
- **THEN** every Beat renders its own `stage` and `sub` label inline next to
  its own content, rather than relying on a pinned, swapping element

### Requirement: TypeLab block
TypeLab SHALL render an interactive variable-font playground: a `sample` string of
text whose rendered weight/width/slant (and any other variable-font axis the
host site ships) can be adjusted live via on-screen controls, optionally
scoped to one `family`. It loads only once visible in the viewport and offers
only the axes the host site's fonts actually ship. Every control SHALL carry a
programmatic label association (not only a visually-adjacent one).

#### Scenario: TypeLab reflects the sample text
- **WHEN** TypeLab is rendered with a `sample` string
- **THEN** that string is present as the text being manipulated by the
  playground's controls

#### Scenario: Every control has an associated label
- **WHEN** TypeLab is rendered
- **THEN** every slider and text input has a `<label>` programmatically
  associated with it (e.g. via `for`/`id`), not only one visually adjacent

### Requirement: ImaxtCover block
ImaxtCover SHALL render a typographic post cover of one `kind` - `word`, `stat`,
`quote`, or `stack` - built from a `text`, an optional `sub`, a `tone`, and the
post `title` (used as the stacked cover's source when no explicit cover is
set). It renders at a given aspect `ratio` suitable for both in-page display
and static image generation (e.g. headless-browser screenshotting for a social
share image). A consumer MAY supply an additional raw `style` string, appended
to the root element's style, for layout needs the component itself does not
anticipate (e.g. a shadow or margin).

#### Scenario: Cover falls back to a stacked title
- **WHEN** ImaxtCover is rendered with no explicit `cover` data
- **THEN** it renders a `stack`-kind cover built from the post's `title`

#### Scenario: Extra style is appended, not replacing the computed style
- **WHEN** ImaxtCover is given a `style` value
- **THEN** the rendered root element's style includes both the computed
  aspect-ratio declaration and the given `style` value

### Requirement: Ranked block
Ranked SHALL render an ordered list from an `items` array of
`{ label, value?, delta? }` entries, numbered by position, with an optional
shared `unit` and an optional `tone`. A numeric `delta` SHALL render a
direction indicator plus the numeric change as real text; a `delta` of
`'new'` SHALL render a distinct "new" indicator instead.

#### Scenario: Rank position follows array order
- **WHEN** Ranked renders three items
- **THEN** each item's rank number matches its position in the `items` array

#### Scenario: Delta direction is readable as text, not color-only
- **WHEN** Ranked renders an item with a numeric `delta`
- **THEN** the numeric change is present as text content, not only as a
  color or icon

### Requirement: Matrix block
Matrix SHALL render a real table from `rows` and `cols` label arrays and a
`cells` grid (`MatrixCell` = `'yes' | 'no' | 'partial' | string`), with an
optional `caption`. Every cell SHALL render its value as text content.

#### Scenario: Cell dimensions must match rows and cols
- **WHEN** a Matrix's `cells` grid does not have exactly `rows.length` rows
  and `cols.length` columns in each row
- **THEN** that data fails validation (per `editorjs-authoring`)

#### Scenario: Cell value is always text
- **WHEN** Matrix renders a cell with value `'yes'`, `'no'`, or `'partial'`
- **THEN** that value's text (or an equivalent word) is present in the
  cell's rendered content, not conveyed by color alone

### Requirement: Delta block
Delta SHALL render a single `label` with a `from` and `to` value, an
optional shared `unit`, and an optional `tone`. When both `from` and `to` are
purely numeric, it SHALL render a direction indicator (up/down/unchanged)
computed from their comparison.

#### Scenario: Numeric comparison renders a direction
- **WHEN** Delta is rendered with numeric `from` and `to` where `to` is
  greater than `from`
- **THEN** it renders an "increase" direction indicator

#### Scenario: Non-numeric values render with no direction indicator
- **WHEN** Delta is rendered with a non-numeric `from` or `to`
- **THEN** it renders both values as static text with no direction
  indicator

### Requirement: Gauge block
Gauge SHALL render a `value` against a `max` as a proportional fill, with an
optional `label`, `unit`, and `tone`. The numeric `value` SHALL always render
as real text content regardless of the visual fill.

#### Scenario: Fill proportion matches value over max
- **WHEN** Gauge renders a `value` equal to half of `max`
- **THEN** its fill renders at half of the gauge's full extent

#### Scenario: Value is present as text
- **WHEN** Gauge renders
- **THEN** its numeric `value` is present as selectable text content

### Requirement: Scorecard block
Scorecard SHALL render a grid of `items`, each `{ label, value, unit?, delta? }`,
with an optional shared `tone`.

#### Scenario: Every item renders its label and value
- **WHEN** Scorecard renders an items array
- **THEN** every item's `label` and `value` are present as text content, in
  the given order

### Requirement: Sparkline block
Sparkline SHALL render an inline trend line from a `values` array of numbers,
with an optional `label`. It SHALL carry a text alternative (e.g. an
`aria-label`) summarizing the value trend, since the line itself does not
expose individual points as text.

#### Scenario: Sparkline carries a text alternative
- **WHEN** Sparkline renders a `values` array
- **THEN** the rendered output carries a text alternative describing the
  trend, not only the visual line

### Requirement: Funnel block
Funnel SHALL render a narrowing sequence of `stages`, each `{ label, value }`,
with an optional shared `unit` and `tone`. Each stage's bar width SHALL be
proportional to the first stage's value, and every stage's value SHALL
render as real text.

#### Scenario: Stage width is proportional to the first stage
- **WHEN** Funnel renders a stage whose value is half of the first stage's
  value
- **THEN** that stage's bar renders at half the width of the first stage's
  bar

#### Scenario: Every stage value is readable as text
- **WHEN** Funnel renders its stages
- **THEN** every stage's numeric value is present as selectable text
  content

### Requirement: Callout block
Callout SHALL render a severity-leveled aside from a `kind` of `note`,
`warning`, `danger`, or `tip` (defaulting to `note`), an optional `title`,
and body `html`.

#### Scenario: Kind renders a distinct label
- **WHEN** Callout is rendered with a given `kind`
- **THEN** a text label distinguishing that kind from the others is
  present in the rendered output

### Requirement: Faq block
Faq SHALL render a list of `items`, each `{ q, a }`, as native
disclosure elements requiring no client-side JavaScript to reveal an
answer.

#### Scenario: Faq works with no client-side JavaScript
- **WHEN** Faq is rendered and no client-side JavaScript executes
- **THEN** each item's question is visible and its answer becomes visible
  through native browser interaction alone

### Requirement: Takeaways block
Takeaways SHALL render a list of string `items`, with an optional `title`.

#### Scenario: Every takeaway renders as text
- **WHEN** Takeaways renders an `items` array
- **THEN** every item's text is present as text content, in the given
  order

### Requirement: Footnote block
Footnote SHALL render a self-contained reference marker and its
definition `html` as a native disclosure element, with an optional
`marker` (defaulting to `*`).

#### Scenario: Footnote works with no client-side JavaScript
- **WHEN** Footnote is rendered and no client-side JavaScript executes
- **THEN** its marker is visible and its definition becomes visible
  through native browser interaction alone

### Requirement: Glossary block
Glossary SHALL render a list of `items`, each `{ term, definition }`, as
a real definition list.

#### Scenario: Every term and definition renders as text
- **WHEN** Glossary renders an `items` array
- **THEN** every item's `term` and `definition` are present as text
  content, in the given order

### Requirement: Versus block
Versus SHALL render exactly two `sides`, each `{ label, html }`, framed
against each other, with an optional `vsLabel` and an optional `tone`.

#### Scenario: Versus always renders exactly two sides
- **WHEN** Versus is rendered
- **THEN** exactly two side entries are present in the rendered output

### Requirement: Checklist block
Checklist SHALL render a list of `items`, each `{ text, done? }`, with an
optional `title`. Each item's done/not-done state SHALL render as a
distinct text glyph, not only a color.

#### Scenario: Done state is readable as text, not color-only
- **WHEN** Checklist renders items with different `done` values
- **THEN** a done item and a not-done item render visibly different text
  glyphs, not only different colors

### Requirement: Terminal block
Terminal SHALL render a sequence of `lines`, each
`{ prompt?, command?, output? }`, with an optional `title`. A line with a
`command` SHALL render its `prompt` (defaulting to `$`) plus the command
text; a line with only `output` SHALL render with no prompt.

#### Scenario: Command line renders its prompt and command
- **WHEN** Terminal renders a line with a `command` and no explicit
  `prompt`
- **THEN** that line renders a `$` prompt followed by the command text

#### Scenario: Output-only line renders with no prompt
- **WHEN** Terminal renders a line with only `output`
- **THEN** that line's rendered content contains no prompt character

### Requirement: Diff block
Diff SHALL render a line-level comparison computed from `before` and
`after` text, with an optional `lang`. Every added and removed line SHALL
be marked with a text prefix (not only a background color).

#### Scenario: Added and removed lines carry a text prefix
- **WHEN** Diff renders a line present only in `after`, and a line present
  only in `before`
- **THEN** the added line's rendered text includes a `+` prefix and the
  removed line's rendered text includes a `-` prefix

#### Scenario: Unchanged lines render with no prefix
- **WHEN** Diff renders a line present in both `before` and `after`
- **THEN** that line renders with neither a `+` nor a `-` prefix

### Requirement: FileTree block
FileTree SHALL render a nested directory listing from a `tree` of
`{ name, children? }` nodes. A node with `children` (a folder) SHALL be
distinguished from a node without (a file) by real text, not an icon.

#### Scenario: Folder is distinguished by text, not an icon
- **WHEN** FileTree renders a node that has `children`
- **THEN** that node's rendered name includes a text marker (e.g. a
  trailing `/`) distinguishing it from a file, with no icon glyph

### Requirement: ErrorBox block
ErrorBox SHALL render a `title` and `message`, with an optional `stack`
rendered as preformatted text preserving whitespace.

#### Scenario: Stack trace preserves whitespace
- **WHEN** ErrorBox is rendered with a `stack` value containing leading
  whitespace on a line
- **THEN** that whitespace is preserved in the rendered output

### Requirement: Changelog block
Changelog SHALL render a sequence of `entries`, each
`{ version, date?, items }`, in the given array order.

#### Scenario: Entries render in given order
- **WHEN** Changelog renders an `entries` array
- **THEN** the rendered sequence preserves that same order

### Requirement: Formula block
Formula SHALL render a `tex` string as typeset math with no client-side
JavaScript, with an optional `display` flag (block vs inline math,
defaulting to inline) and an optional `caption`. Malformed `tex` SHALL
render an inline error marker rather than throwing or failing the
surrounding render.

#### Scenario: Formula renders with no client-side JavaScript
- **WHEN** Formula is rendered and no client-side JavaScript executes
- **THEN** the typeset math is visible in the output

#### Scenario: Display flag selects block vs inline layout
- **WHEN** Formula is rendered with `display` set to `true`
- **THEN** its output is marked for block ("display") math layout, distinct
  from the default inline layout

#### Scenario: Malformed tex does not throw
- **WHEN** Formula is rendered with a `tex` value that is not valid LaTeX
- **THEN** rendering completes without throwing, producing an inline error
  marker in place of typeset output

#### Scenario: Caption renders when given
- **WHEN** Formula is rendered with a `caption` value
- **THEN** that caption is present as text content in the output

### Requirement: Ticker block
Ticker SHALL render every entry of a `phrases` array as real text, with
an optional `seconds` interval and an optional `tone`. With no
client-side JavaScript, or when `prefers-reduced-motion: reduce` is
signalled, every phrase SHALL remain visible rather than cycling.

#### Scenario: Every phrase is present as text
- **WHEN** Ticker renders a `phrases` array
- **THEN** every phrase's text is present in the rendered output

#### Scenario: No JavaScript or reduced motion shows every phrase
- **WHEN** Ticker is rendered with no client-side JavaScript executing, or
  attached in an environment with `prefers-reduced-motion: reduce`
- **THEN** every phrase remains visible with no cycling

### Requirement: DropCap block
DropCap SHALL render body `html` whose first character is visually
distinguished as an oversized drop cap, with an optional `tone`, while
the full text content (including that first character) remains in the
normal reading order.

#### Scenario: First character is distinguished, text order preserved
- **WHEN** DropCap renders body html beginning with a letter
- **THEN** that letter is present as the first character of the
  rendered text content, distinguished from the rest by its own markup

### Requirement: Redacted block
Redacted SHALL render body `html` hidden behind a redaction bar, revealed
via a native disclosure element requiring no client-side JavaScript, with
an optional `revealLabel` used as its accessible name.

#### Scenario: Redacted works with no client-side JavaScript
- **WHEN** Redacted is rendered and no client-side JavaScript executes
- **THEN** its hidden content becomes visible through native browser
  interaction alone

### Requirement: Stamp block
Stamp SHALL render a short `text` as a rotated typographic marker, with
an optional `angle` (defaulting to a fixed tilt) and an optional `tone`.

#### Scenario: Stamp text is present as text
- **WHEN** Stamp renders a `text` value
- **THEN** that text is present as real, selectable text content

### Requirement: Banner block
Banner SHALL render a short `text` as a static oversized word or phrase,
with an optional `tone`.

#### Scenario: Banner text is present as text
- **WHEN** Banner renders a `text` value
- **THEN** that text is present as real, selectable text content
</content>
