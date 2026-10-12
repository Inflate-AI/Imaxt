# Spec Delta

## ADDED Requirements

### Requirement: Embed block
Embed SHALL render a styled link card for an external `url`, with an
optional `caption`. It SHALL NOT render an `<iframe>` or any other
live-embedded (non-link) content.

#### Scenario: Embed renders as a link, not an iframe
- **WHEN** Embed is rendered with a `url`
- **THEN** the output contains an anchor (`<a>`) element pointing at that
  `url`, and contains no `<iframe>` element

#### Scenario: Caption renders when given
- **WHEN** Embed is rendered with a `caption` value
- **THEN** that caption is present as text content in the output
