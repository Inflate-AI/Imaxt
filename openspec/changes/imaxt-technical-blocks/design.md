# Design

## Diff computes its own line diff

Rather than ask authors to hand-write unified-diff syntax, `Diff` takes
plain `before`/`after` text and computes a line-level diff itself using a
minimal LCS (longest-common-subsequence) algorithm over the two line
arrays - standard dynamic programming, no dependency, adequate for the
short code/config snippets this block is meant for. Each output line
renders tagged `same`/`add`/`del`, with the `+`/`-` prefix (or none)
present as real text, not conveyed by background color alone.

## FileTree uses text markers, not icons

Per Imaxt's typography-only visual language (no images/icons anywhere in
the package), `FileTree` distinguishes a folder from a file by a trailing
`/` on its name (real text) plus a CSS weight/indent difference - never an
icon glyph standing in for file type.

## Data shapes

```ts
interface TerminalLine { prompt?: string; command?: string; output?: string }
interface TerminalData { lines: TerminalLine[]; title?: string }

interface DiffData { before: string; after: string; lang?: string }

interface FileTreeNode { name: string; children?: FileTreeNode[] }
interface FileTreeData { tree: FileTreeNode[] }

interface ErrorBoxData { title: string; message: string; stack?: string }

interface ChangelogEntry { version: string; date?: string; items: string[] }
interface ChangelogData { entries: ChangelogEntry[] }
```

## Rendering notes

- **Terminal**: each line with a `command` renders the `prompt` (default
  `$`) plus the command as typed; a line with only `output` renders dimmed,
  with no prompt.
- **ErrorBox**: `stack`, when given, renders as a `<pre>` block so
  whitespace/indentation stays intact.
- **Changelog**: entries render newest-first in the given array order (the
  author controls ordering, the block does not re-sort).
