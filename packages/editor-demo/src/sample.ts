export const SAMPLE_DOCUMENT = `# Why Imaxt

This is a **Medium-style** editor whose native format *is* Markdown/MDX.
Standard Markdown works exactly like you'd expect - [a link](https://github.com/Inflate-AI/Imaxt),
\`inline code\`, and everything else below - and the same \`/\` menu reaches
every Imaxt block, inserted on this same document with zero conversion
step. This article uses one of each to prove it.

<Statement tone="mint" align="center">
  Most articles reach for a screenshot. Imaxt reaches for **type**.
</Statement>

## The pitch

<PullQuote by="The Imaxt README">
  Typographic article blocks - no images, no icons, just type doing the
  work of figures.
</PullQuote>

<Sidenote label="Why it matters">
  A chart rendered as real text is selectable, themeable, and never goes
  blurry on a retina display.
</Sidenote>

<DropCap tone="accent">
  Forty-one blocks ship today, covering narrative writing, data, technical
  documentation, and pure typography - and every one of them is a React
  component inside this editor, not a screenshot pasted in from somewhere
  else.
</DropCap>

## The pillars

| Pillar | What it means |
| --- | --- |
| Markdown | Headings, lists, tables, checklists, quotes, code, links, images |
| Imaxt | The same \`/\` menu inserts a typographic block, rendered live |

- [x] Full Markdown editing
- [x] Imaxt blocks on the same document
- [ ] Try it yourself - press \`/\` on a new line

## The data side

<Bars unit="%" tone="accent" items={[{ label: "Lexical bridge", value: 95 }, { label: "Block coverage", value: 100 }, { label: "Theming", value: 90 }]} />

<Ranked unit="blocks" items={[{ label: "Mechanical, config-driven", value: "34" }, { label: "Custom editing UI", value: "3", delta: "new" }, { label: "Markdown-native", value: "4" }]} />

<StatRow>
  <Stat value={41} label="Imaxt blocks" tone="mint" />
  <Stat value={"0"} unit="conversions" label="to add one to a doc" tone="sky" />
  <Stat value={"1"} unit="editor" label="for prose and data" tone="lilac" />
</StatRow>

<Delta label="Time to insert a block" from={"a screenshot tool"} to={"one slash command"} tone="accent" />

<Gauge value={92} max={100} label="Editor completeness" unit="%" tone="mint" />

<Scorecard tone="sky" items={[{ label: "Bridge tests", value: 8, unit: "passing" }, { label: "Block types wired", value: 41 }]} />

<Sparkline values={[12, 18, 14, 22, 30, 28, 35]} label="Weekly commits while building this" />

<Funnel unit="packages" tone="accent" stages={[{ label: "imaxt-core", value: 1 }, { label: "imaxt-mdx", value: 1 }, { label: "imaxt-editor", value: 1 }]} />

<Matrix rows={["Markdown", "Imaxt blocks"]} cols={["Live preview", "Theming", "Slash menu"]} cells={[["yes", "yes", "yes"], ["yes", "yes", "yes"]]} caption="Both pillars, the same guarantees" />

<Heatmap rows={["Prose", "Data", "Technical"]} cols={["Mon", "Tue", "Wed"]} data={[[2, 4, 6], [1, 3, 5], [0, 2, 4]]} min={0} max={6} caption="Where the writing happened this week" />

## Explaining and reassuring

<Callout kind="tip" title="Try the slash menu">
  Press *slash* on an empty line to insert a heading, a table, an image, or
  any Imaxt block - everything on this page included.
</Callout>

<Faq items={[{ q: "Does this replace Markdown?", a: "No - it is Markdown, plus more block types." }, { q: "Can I use it with no Imaxt blocks at all?", a: "Yes - it is a complete plain-Markdown editor on its own." }]} />

<Takeaways title="Key takeaways" items={["One document model for prose and data", "Theming matches the host page automatically", "Images upload in the background, preview instantly"]} />

<Footnote marker="1">
  The bridge is tested with real round-trips, not just unit mocks.
</Footnote>

<Glossary items={[{ term: "mdast", definition: "The Markdown AST both the editor and imaxt-mdx share." }, { term: "DecoratorNode", definition: "Lexical's escape hatch for embedding a React component as a block." }]} />

<Versus vsLabel="vs" tone="accent" sides={[{ label: "Screenshot-based editors", html: "Blurry on retina, impossible to theme, unselectable." }, { label: "Imaxt", html: "Real text, real theming, real accessibility." }]} />

<Checklist title="Before publishing" items={[{ text: "Write the body", done: true }, { text: "Insert at least one data block", done: true }, { text: "Proofread", done: false }]} />

## Technical writing

<Terminal title="Try it locally" lines={[{ prompt: "$", command: "bun add @inflate-ai/imaxt-editor" }, { output: "installed in 1.2s" }]} />

<Diff before="const html = renderX(data);" after="const node = createImaxtBlockNode(block);" lang="tsx" />

<FileTree tree={[{ name: "packages", children: [{ name: "editor", children: [{ name: "src" }] }, { name: "core" }, { name: "mdx" }] }]} />

<ErrorBox title="Before Imaxt" message="Cannot read property 'theme' of undefined" stack="    at renderScreenshot (legacy-tool.js:42)" />

<Changelog entries={[{ version: "0.1.0", date: "2026-10-12", items: ["Lexical<->mdast bridge", "All 41 blocks reachable from the slash menu", "Configurable theme + pluggable image uploads"] }]} />

<Formula tex="\\text{value} = \\text{type} \\times \\text{intent}" caption="The whole thesis, as a formula" />

<CodeWalk steps={[{ lines: "1", title: "Parse", text: "Walk the mdast tree for GFM and Imaxt JSX." }, { lines: "2", title: "Bridge", text: "Map each node onto a Lexical node, one-to-one." }, { lines: "3", title: "Serialize", text: "Walk it back out losslessly." }]}>

\`\`\`ts
const tree = fromMarkdown(source, PARSE_OPTIONS);
const lexicalNode = mastNodeToLexical(tree);
\`\`\`

</CodeWalk>

## Pure typography

<Ticker tone="accent" phrases={["No images", "No icons", "Just type"]} />

<Banner text="Zero screenshots were harmed" tone="rose" />

<Marquee tone="sky" words={["Markdown", "Imaxt", "One editor"]} />

<CurvedText text="Imaxt" shape="circle" mark="I" tone="mint" spin />

<TypeLab sample="Same letters, different voice" family="fraunces" />

<Redacted revealLabel="Reveal the twist">
  This whole article was written **inside** the editor it's describing.
</Redacted>

<Stamp text="SHIPPED" tone="accent" angle={-8} />

## Structure

<Compare>

  <Side kind="before" label="Before">
    A design tool, a screenshot, a paste.
  </Side>

  <Side label="After">
    One slash command, rendered live, themed automatically.
  </Side>

</Compare>

<Steps>

  <Step title="Press slash">
    Open the insert menu on any empty line.
  </Step>

  <Step title="Pick a block">
    Search across Markdown and all 41 Imaxt blocks.
  </Step>

  <Step title="Edit inline">
    Fill in the generated form - the preview updates live.
  </Step>

</Steps>

<Timeline>

  <Event date="Phase 1" title="Foundation">
    GFM support and an Embed block landed in imaxt-mdx.
  </Event>

  <Event date="Phase 2" title="Core editor">
    The Lexical bridge and Medium-style UX came together.
  </Event>

  <Event date="Phase 5" title="This demo">
    Deployed to GitHub Pages, writing its own launch article.
  </Event>

</Timeline>

<Scrolly tone="lilac">

  <Beat stage="Parse" sub="mdast">
    Markdown and MDX become one tree.
  </Beat>

  <Beat stage="Bridge" sub="Lexical">
    Every node becomes something editable.
  </Beat>

  <Beat stage="Publish" sub="MDX">
    It all serializes back out, losslessly.
  </Beat>

</Scrolly>

## Linking out

<Embed url="https://github.com/Inflate-AI/Imaxt" caption="The source for everything on this page" />

<Callout kind="tip" title="Your turn">
  Press *slash* anywhere below this line and start writing.
</Callout>
`;
