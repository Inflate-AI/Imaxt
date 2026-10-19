# Architecture

Imaxt publishes one package with two focused entry points.

```text
@inflate-ai/imaxt/core
  block data types
  render*(data): string
  attach*(root): dispose
  block styles

@inflate-ai/imaxt/editor
  React/Lexical editing UI
  Markdown/MDX string input and output
  private MDX codec and Lexical state handling
```

## Core

Core is framework-neutral. It owns block data shapes, HTML rendering, CSS, and
the browser hydration required by interactive blocks. It has no React, Lexical,
Markdown, or MDX dependency.

## Editor

The editor is a React integration built on Lexical. It renders and edits Imaxt
blocks alongside standard Markdown and GFM content. Its public contract is an
uncontrolled `initialValue?: string` and `onChange?: (source: string) => void`.
Those strings use the established Imaxt MDX component syntax for custom blocks.
The codec and Lexical state are private editor implementation details.

## Deliberate exclusions

Imaxt does not publish an Astro package, EditorJS tools, or a standalone generic
MDX compiler. Applications persist editor output as Markdown/MDX and may adopt
their own delivery pipeline outside this package.
