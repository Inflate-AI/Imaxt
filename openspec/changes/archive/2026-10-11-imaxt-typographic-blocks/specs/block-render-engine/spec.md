# Spec Delta

## ADDED Requirements

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
