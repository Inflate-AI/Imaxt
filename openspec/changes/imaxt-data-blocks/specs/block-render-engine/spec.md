# Spec Delta

## ADDED Requirements

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
