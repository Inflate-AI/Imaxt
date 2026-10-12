# Design

## GFM support

`mdast-util-gfm` bundles the four mdast-util-gfm-* packages
(autolink-literal, footnote, strikethrough, table, task-list-item)
behind one import, matching `mdast-util-mdx`'s own "one bundled
extension" shape already used in this file - no reason to hand-pick
the sub-extensions when the bundle already composes them the same way
this codebase already composes `mdxjs`/`frontmatter`. Added to both
`from-mdx.ts`'s `PARSE_OPTIONS` (`extensions`/`mdastExtensions`) and
`to-mdx.ts`'s `blocksToMdx`'s `toMarkdown` call (`extensions`), the
same two places `mdxjs()`/`frontmatterToMarkdown()` already sit.

No `Block` type changes are needed for this part: GFM nodes
(`table`, `tableRow`, `tableCell`, `listItem.checked`,
`delete`/strikethrough) all live inside the `markdown` passthrough's
`stringifyFragment`/`fromMarkdown` round trip already, which operates
on whatever mdast node types its loaded extensions produce - adding
the extension is sufficient; the passthrough logic itself is
unchanged.

## Embed block

### Why a link card, not an `<iframe>`

The one real consuming site this ecosystem has (saranmahadev/blog)
has an explicit content policy against `<iframe>`s, third-party
embeds, and social widgets, enforced by its own CSP and documented in
its `ARTICLE_GUIDE.md`: "link out instead." Building `Embed` as a
live iframe embed would ship a block its one real consumer could
never actually use. A styled link card - a title/URL and an optional
caption, rendered as a plain anchor - needs no `<iframe>`, no
`unsafe-inline`/`frame-src` CSP relaxation, and is exactly the
"link out instead" pattern that guide asks for, just with a nicer
on-page treatment than a bare Markdown link.

### Data shape

```ts
export interface EmbedData {
  url: string;
  caption?: string;
}
```

### Render

```ts
export function renderEmbed(data: EmbedData): string {
  const caption = data.caption
    ? `<figcaption>${escapeHtml(data.caption)}</figcaption>`
    : '';
  return (
    `<figure class="imx"><a class="imx-embed" href="${escapeHtml(data.url)}" ` +
    `target="_blank" rel="noopener noreferrer">${escapeHtml(data.url)}</a>${caption}</figure>`
  );
}
```

Matches `Banner`'s shape most closely among existing blocks (one
primary string field, no tone, no composite children) - `EmbedTool`
and `Embed.astro` follow `BannerTool`/`Banner.astro` as their direct
templates, minus the tone picker (`Embed` has no `tone`).

### MDX mapping

`<Embed url="..." caption="..." />` - a self-closing element with two
string attributes, the simplest shape in `to-mdx.ts`/`from-mdx.ts`
(no HTML-bearing child content to round-trip through
`htmlToPhrasing`/`phrasingToHtml`, unlike `Statement`/`Callout`/etc.).

## Single-node converters

`to-mdx.ts`'s `blockToNode(block: Block): unknown` and
`from-mdx.ts`'s `elementToBlock(element: MdxJsxElement): Block | null`
already operate per-node internally (the whole-document functions are
thin loops around them) - this change exports them under the public
names `blockToMdastNode`/`mdastNodeToBlock` with no behavior change,
just visibility. `MdxJsxElement` (from `jsx-node.ts`) becomes part of
the public surface alongside them, since a caller needs it to express
the input type of `mdastNodeToBlock`.
