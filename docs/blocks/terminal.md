# Terminal

A command/output transcript, rendered as real text, not a screenshot.

## Data shape

```ts
interface TerminalLine {
  prompt?: string;   // default: "$"
  command?: string;
  output?: string;
}

interface TerminalData {
  lines: TerminalLine[];
  title?: string;
}
```

## EditorJS

`TerminalTool` manages a repeatable list of command/output rows plus an
optional title field.

## Astro / MDX

```mdx
<Terminal title="Setup" lines={[
  { command: "npm install" },
  { output: "added 42 packages" },
]} />
```
