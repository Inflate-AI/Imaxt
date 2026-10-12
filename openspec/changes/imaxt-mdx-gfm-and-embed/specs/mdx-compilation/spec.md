# Spec Delta

## ADDED Requirements

### Requirement: GFM constructs round-trip through the markdown passthrough
A GFM table, a GFM task-list item (including its checked state), and
GFM strikethrough, present in content carried by the `markdown`
passthrough block, SHALL round-trip losslessly through compile-then-parse,
the same guarantee `Requirement: Round-trip through MDX is lossless`
already makes for recognized Imaxt components.

#### Scenario: GFM table round-trips
- **WHEN** MDX containing a GFM table is compiled and then parsed back
- **THEN** the recovered table structure (rows and cells) is deep-equal
  to the original

#### Scenario: GFM task-list checked state round-trips
- **WHEN** MDX containing a GFM task-list item marked checked is compiled
  and then parsed back
- **THEN** the recovered item's checked state is `true`

### Requirement: Single-node conversion is part of the public API
The package SHALL export `blockToMdastNode` and `mdastNodeToBlock`
functions converting one `Block` to its corresponding mdast/MDX-JSX
node and back, independent of the whole-document `blocksToMdx`/
`mdxToBlocks` functions, so a caller that already has one block (not
a full document) does not need to assemble a one-element document just
to convert it.

#### Scenario: Converting a single block without a document
- **WHEN** `blockToMdastNode` is called with one `Block`
- **THEN** it returns the same node `blocksToMdx` would produce for a
  one-block document, without requiring a document wrapper as input
