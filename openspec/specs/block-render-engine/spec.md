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
</content>
