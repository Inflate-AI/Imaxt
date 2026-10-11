# Checklist

A static done/not-done list, with each item's state rendered as a
distinct text glyph rather than color alone.

## Data shape

```ts
interface ChecklistItem {
  text: string;
  done?: boolean;
}

interface ChecklistData {
  items: ChecklistItem[];
  title?: string;
}
```

## EditorJS

`ChecklistTool` manages a repeatable list of text/done rows plus an
optional title field.

## Astro / MDX

```mdx
<Checklist title="Launch checklist" items={[
  { text: "Write tests", done: true },
  { text: "Ship it" },
]} />
```
