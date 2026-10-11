# Spec Delta

## ADDED Requirements

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
