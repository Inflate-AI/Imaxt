# CodeWalk

A code sample alongside a sequence of steps. Clicking a step highlights
the lines it talks about; without JavaScript, every line and every step's
text stay fully visible.

## Data shape

```ts
interface CodeWalkStep {
  lines: string;   // "1", "2-3", or "1,3-4"
  title: string;
  text?: string;
}

interface CodeWalkData {
  code: string;            // plain text - no syntax highlighting (see note below)
  steps: CodeWalkStep[];
  wide?: boolean;
}
```

## EditorJS

`CodeWalkTool` is composite: a plain textarea for the code sample, plus a
repeatable list of steps (lines/title/text), with add/remove controls.

## Astro / MDX

```mdx
<CodeWalk
  code={`const id = \`\${doc.id}:\${chunk.index}\`;\nawait index.upsert({ id, vector });`}
  steps={[
    { lines: "1", title: "Stable id", text: "Same chunk, same id." },
    { lines: "2-3", title: "Upsert", text: "Replaces instead of duplicating." },
  ]}
/>
```

## Notes

- **No syntax highlighting.** `imaxt-core` has zero runtime dependencies
  and doesn't ship a highlighter, so `code` is plain text, escaped and
  split into `.line`-classed spans for the highlight-on-click behavior.
  Layering a highlighter on top (in a consuming site, or as a later
  addition here) only needs to produce that same `.line`-per-line
  structure to keep the click behavior working.
