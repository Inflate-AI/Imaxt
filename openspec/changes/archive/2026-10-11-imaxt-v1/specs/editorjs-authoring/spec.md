# Spec Delta

## Purpose

Defines how each Imaxt block behaves as an EditorJS Block Tool: its toolbox
entry, its editable fields and live preview, the shape of the data it saves,
and how invalid data is rejected, so a visual builder can author every block
`block-render-engine` defines.

## ADDED Requirements

### Requirement: Every block is a discoverable toolbox entry
Every Imaxt block (per `block-render-engine`) SHALL be registered as an EditorJS
Block Tool with a toolbox entry carrying an icon and a human-readable title,
so it is discoverable in the EditorJS block-insertion menu.

#### Scenario: Block appears in the toolbox
- **WHEN** an Imaxt tool is registered with an EditorJS instance
- **THEN** its toolbox entry appears in that instance's block-insertion menu
  with a title and icon

### Requirement: Live preview matches the render engine
While a block is being edited, its on-canvas preview SHALL be produced by the
same rendering logic `block-render-engine` defines for that block, so what the
author sees in the editor matches what the block renders to on publish.

#### Scenario: Editing preview reflects a field change
- **WHEN** an author changes an editable field of a block in the EditorJS
  canvas
- **THEN** the block's on-canvas preview updates to the output
  `block-render-engine` would produce for that new data

### Requirement: Saved data matches the block's documented shape
Each tool's `save()` SHALL return a plain JSON-serializable object whose shape
exactly matches that block's documented data shape (the same shape
`mdx-compilation` reads and writes), with no DOM nodes, functions, or other
non-serializable values.

#### Scenario: Saved output round-trips through JSON
- **WHEN** a tool's `save()` output is passed through `JSON.stringify` and
  `JSON.parse`
- **THEN** the resulting object is deep-equal to the original `save()` output

### Requirement: Invalid data fails validation
Each tool SHALL reject, via its `validate()` method, saved data missing a
field that block requires to render meaningfully (for example, a Stat with no
`value`, or a Heatmap whose `data` grid does not match its `rows`/`cols`
dimensions).

#### Scenario: Required field missing fails validation
- **WHEN** a tool's saved data is missing a field that block's render contract
  requires
- **THEN** that tool's `validate()` returns false for that data

### Requirement: Composite blocks manage their own repeatable children
Blocks that nest children in MDX (`StatRow`, `Compare`, `Steps`, `Timeline`,
`Scrolly`, `CodeWalk`) are each a single EditorJS tool that manages its
children as an internal, repeatable list with add/remove controls, rather
than as separate EditorJS blocks. `Compare` SHALL always manage exactly two
sides; the others accept zero or more entries.

#### Scenario: Adding a child entry
- **WHEN** an author uses a composite block's "add" control
- **THEN** a new child entry appears in that block's internal list, and the
  block's `save()` output includes it

#### Scenario: Removing a child entry
- **WHEN** an author removes a child entry from a composite block
- **THEN** that entry no longer appears in the block's internal list or in
  its `save()` output

#### Scenario: Compare always has exactly two sides
- **WHEN** a Compare tool is initialized with no prior data
- **THEN** it starts with exactly two side entries and offers no control to
  reduce below two or add a third

### Requirement: Shared tone picker across tools
Every tool whose block accepts a `tone` (per `block-render-engine`) SHALL expose
the same block-settings tone picker, offering exactly the tones
`block-render-engine` defines, so authors have one consistent control across
every tonal block rather than a bespoke one per tool.

#### Scenario: Tone picker offers the shared tone set
- **WHEN** an author opens the block-settings tone picker on any tonal block
- **THEN** the offered choices are exactly `mint`, `lilac`, `sky`, `rose`,
  `accent`, `ink`

### Requirement: ImaxtCover is not an EditorJS body tool
ImaxtCover (per `block-render-engine`) is post-level data, not an EditorJS
body block: it SHALL NOT be registered as a toolbox entry and SHALL NOT be
insertable into the block canvas.

#### Scenario: ImaxtCover does not appear in the toolbox
- **WHEN** the full set of Imaxt EditorJS tools is registered with an
  EditorJS instance
- **THEN** no toolbox entry for ImaxtCover appears in the block-insertion menu
