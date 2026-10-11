# Spec Delta

## ADDED Requirements

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
