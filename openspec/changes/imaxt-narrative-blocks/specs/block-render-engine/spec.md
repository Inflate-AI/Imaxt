# Spec Delta

## ADDED Requirements

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
