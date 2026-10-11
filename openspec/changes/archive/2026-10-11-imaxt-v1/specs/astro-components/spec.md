# Spec Delta

## Purpose

Defines the public Astro component surface that exposes `block-render-engine`
to `.astro` and `.mdx` content, for sites that author Imaxt blocks directly
rather than through an EditorJS-based builder.

## ADDED Requirements

### Requirement: Each block has a matching Astro component
Every block `block-render-engine` defines (including the composite parent and
child pairs) SHALL be available as an Astro component whose props match that
block's documented data shape, and whose rendered output matches the output
`block-render-engine` produces for the same data.

#### Scenario: Astro component output matches the render engine
- **WHEN** an Astro component for a given block is rendered with a given set
  of props
- **THEN** its rendered HTML matches the HTML `block-render-engine` produces
  for the same data

### Requirement: Composite components accept children via slots
The Astro components for composite blocks (`StatRow`, `Compare`, `Steps`,
`Timeline`, `Scrolly`) SHALL accept their repeatable entries as nested child
components passed through Astro's default slot, matching the existing
hand-written MDX nesting syntax.

#### Scenario: StatRow renders nested Stat children
- **WHEN** a `StatRow` Astro component is rendered with `Stat` components
  passed as children
- **THEN** each child renders as part of the StatRow's output in the given
  order

### Requirement: Single import exposes every block
A single module export (an `imaxt` object, matching the existing convenience
import used by hand-written Imaxt MDX posts) SHALL provide every standalone
and composite-parent block component by name, so a post can use any block
without a separate import statement per block.

#### Scenario: Using a block via the convenience import
- **WHEN** an `.mdx` post is passed the `imaxt` object as its available
  components
- **THEN** every block component is usable in that post's body with no
  additional per-block import

### Requirement: TypeLab loads only once visible
The Astro component for TypeLab SHALL defer loading its interactive behavior
until the component is visible in the viewport, rather than on initial page
load.

#### Scenario: TypeLab is below the fold
- **WHEN** a page renders a TypeLab component that is outside the initial
  viewport
- **THEN** its interactive behavior is not loaded until it scrolls into view

### Requirement: Package passes Astro's own type checking
The package's `.astro` component sources SHALL pass `astro check` with zero
errors.

#### Scenario: Running astro check
- **WHEN** `astro check` is run against the package's component sources
- **THEN** it reports zero errors
