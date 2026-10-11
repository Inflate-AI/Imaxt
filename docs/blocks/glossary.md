# Glossary

A term/definition list, rendered as a real `<dl>`.

## Data shape

```ts
interface GlossaryItem {
  term: string;
  definition: string;
}

interface GlossaryData {
  items: GlossaryItem[];
}
```

## EditorJS

`GlossaryTool` manages a repeatable list of term/definition rows.

## Astro / MDX

```mdx
<Glossary items={[
  { term: "RAG", definition: "Retrieval-augmented generation" },
  { term: "LLM", definition: "Large language model" },
]} />
```
