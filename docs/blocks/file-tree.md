# FileTree

A typographic directory listing - folders distinguished from files by a
trailing `/` (real text), never an icon.

## Data shape

```ts
interface FileTreeNode {
  name: string;
  children?: FileTreeNode[];   // presence of this field means "folder"
}

interface FileTreeData {
  tree: FileTreeNode[];
}
```

## EditorJS

`FileTreeTool` manages a recursive repeatable list: each entry has a
name, a folder checkbox, and (when checked) its own nested list.

## Astro / MDX

```mdx
<FileTree tree={[
  { name: "src", children: [
    { name: "core", children: [{ name: "bars.ts" }] },
    { name: "index.ts" },
  ] },
]} />
```
