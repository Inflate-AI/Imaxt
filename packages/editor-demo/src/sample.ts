export const SAMPLE_DOCUMENT = `# What Imaxt actually is

<Statement tone="mint" align="center">
  Imaxt is typography that argues **its own case** - numbers, diagrams, and asides rendered as real text, not screenshots.
</Statement>

Imaxt is a library of **41 blocks** for Markdown/MDX articles, grouped into six
categories below. Every one of them renders as real HTML - selectable,
themeable, readable by a screen reader - styled almost entirely through type
and color, the same way this sentence is. None of them are images. This page
shows every one of the 41, filled with real data, with its own purpose and
usage explained alongside it.

<PullQuote by="Imaxt's own design note">
  If a chart can be a sentence instead, make it a sentence.
</PullQuote>

Every block on this page was inserted the same way: press \`/\` on an empty
line, search, pick a block, fill in its fields. There is one document model
underneath all of it, so writing a paragraph and inserting a block are not
two different modes - they're just the next line.

## The six categories

<Matrix rows={["Typography", "Data & Stats", "Narrative", "Technical", "Visual & Motion", "Media"]} cols={["Blocks", "What it's for"]} cells={[["9", "making a sentence or a term carry more weight"], ["10", "numbers and comparisons as real text"], ["9", "structuring how a reader moves through an argument"], ["7", "writing about code and systems"], ["5", "decorative, display-scale typography"], ["1", "linking out"]]} caption="41 blocks, six jobs" />

### Typography

Nine blocks whose only job is making one sentence, one term, or one equation
carry more weight than the paragraph around it - \`Statement\` and
\`PullQuote\`, both used above, belong here too.

<Sidenote label="Sidenote">
  A short aside set beside the text instead of inside it - a definition, a
  caveat, a "by the way" that would break the sentence if left inline.
</Sidenote>

<DropCap tone="accent">
  DropCap opens a section with an oversized first letter, the classic
  magazine move - done in CSS, not an image, so it still reflows and still
  passes to a screen reader as plain text.
</DropCap>

<Footnote marker="1">
  Footnote pairs a small marker in the running text with an aside below it - for a citation, worth checking¹: variable fonts ship every weight, width, and optical size in a single file, which is what TypeLab, further down this page, actually lets a reader feel for themselves.
</Footnote>

<Glossary items={[{ term: "mdast", definition: "The Markdown abstract syntax tree every Imaxt block round-trips through on its way to and from MDX text." }, { term: "tone", definition: "A named color preset - mint, lilac, sky, rose, accent, ink, or white - that adapts automatically to dark mode." }, { term: "block", definition: "One typed, structured unit of content. A paragraph is a block too - just an unstyled one." }]} />

<Redacted revealLabel="Reveal">
  Glossary defines a handful of terms together, once - instead of a parenthetical explaining "mdast" every single time it comes up on this page.
</Redacted>

<Stamp text="SHIPPED" angle={-8} tone="rose" />

Stamp drops a rotated, inked label onto the page - "DRAFT", "APPROVED",
whatever a document needs to announce about itself, the way the one above
announces this page's own Mermaid block.

<Formula tex="\\varphi = \\frac{1 + \\sqrt{5}}{2}" display={true} caption="The golden ratio - one of several scale ratios a heading hierarchy could use" />

Formula typesets real math with KaTeX, not a screenshot of an equation - it's
selectable text that reflows with everything around it, not a fixed-width
image.

### Data & Stats

Ten blocks turn a number into something you can actually read, not a
screenshot of a chart. \`Matrix\`, used above for the six-category table, is
one of them.

<Bars unit=" blocks" tone="sky" items={[{ label: "Typography", value: 9 }, { label: "Data & Stats", value: 10 }, { label: "Narrative", value: 9 }, { label: "Technical", value: 7 }, { label: "Visual & Motion", value: 5 }, { label: "Media", value: 1 }]} />

Bars compares a handful of values side by side - here, the same six category
counts from the table above, as plain bars instead of a grid.

<Delta label="A dashboard screenshot, vs." from={"one PNG, uneditable"} to={"one Scorecard, real text"} tone="accent" />

Delta is a single before/after pair - the smallest possible comparison,
built for exactly two values and nothing else.

<Ranked unit=" blocks" tone="sky" items={[{ label: "Data & Stats", value: "10", delta: "+1" }, { label: "Typography", value: "9", delta: "+2" }, { label: "Narrative", value: "9", delta: "+1" }, { label: "Technical", value: "7", delta: "+1" }, { label: "Visual & Motion", value: "5", delta: "" }, { label: "Media", value: "1", delta: "" }]} />

Ranked is Delta's bigger sibling - an ordered list where each row can also
show the move since last time, not just the current value.

<Gauge value={35} max={41} label="Blocks with zero client-side JS" unit=" of 41" tone="mint" />

Gauge reads a single value against its maximum at a glance - here, the 35 of
41 blocks that render as plain static HTML, no JavaScript required.

<Scorecard items={[{ label: "Total blocks", value: "41", unit: "", delta: "" }, { label: "Categories", value: "6", unit: "", delta: "" }, { label: "Tone presets", value: "7", unit: "", delta: "" }, { label: "Interactive blocks", value: "6", unit: "", delta: "+1" }]} tone="lilac" />

Scorecard groups several related metrics into one row of stat cards - a
compact dashboard instead of four separate Delta blocks.

<Sparkline values={[28, 33, 37, 40, 41]} label="Block count across the last five releases" />

Sparkline draws a trend as a single inline line - not meant to be read
precisely, just to show the shape of a change over time.

<Funnel unit=" writers" tone="accent" stages={[{ label: "Opened the slash menu", value: 100 }, { label: "Searched or browsed", value: 86 }, { label: "Picked a block", value: 74 }, { label: "Filled in the form", value: 69 }, { label: "Published", value: 65 }]} />

Funnel shows where a sequence loses people - each stage a little narrower
than the last, the drop-off itself the point.

<Heatmap rows={["mint", "lilac", "sky", "rose", "accent", "ink"]} cols={["Light mode", "Dark mode"]} data={[[4.6, 7.1], [4.8, 7.4], [4.3, 6.9], [4.9, 7.8], [5.1, 8.2], [12.6, 14.1]]} caption="Text contrast ratio by tone" unit=":1" />

Heatmap colors a grid of numbers by magnitude - here, every tone's text
contrast ratio in light and dark mode, all comfortably above the 4.5:1
minimum for body text.

\`StatRow\`, the tenth Data & Stats block, shows up below in "Tones, not
stock photos" - doing exactly its job there, for Imaxt's own tone presets.

### Narrative

<Callout kind="tip" title="Structure, not decoration">
  Callout, FAQ, Takeaways, Checklist, Versus, Compare, Steps, Timeline, and
  Scrolly don't decorate a sentence - they structure the article itself: a
  side-by-side, a sequence, a question a reader actually has.
</Callout>

<Versus sides={[{ label: "A static code block", html: "Shows a diagram's source text - a reader has to parse the syntax themselves to see the shape of it." }, { label: "The Mermaid block above", html: "Renders that same source as a real, themed diagram - still just text underneath, now actually legible." }]} vsLabel="VS" tone="sky" />

Versus is a dedicated two-sided comparison - unlike Delta's single number
pair, each side here can hold a full paragraph.

<Timeline>
  <Event date="Step 1" title="Parse">
    Markdown and Imaxt JSX become one \`mdast\` tree.
  </Event>
  <Event date="Step 2" title="Bridge">
    Each mdast node maps onto a Lexical node, one-to-one, inside the editor.
  </Event>
  <Event date="Step 3" title="Serialize">
    It all writes back out to MDX, losslessly - the same round trip this
    block type is tested against.
  </Event>
  <Event date="Step 4" title="Publish">
    Blog and Prox render that MDX text through \`imaxt-astro\` or
    \`imaxt-core\` directly - no separate preview step.
  </Event>
</Timeline>

Timeline orders events along a single axis - the same pipeline the Mermaid
diagram above draws as a graph, here as a sequence instead.

\`Faq\`, \`Checklist\`, and \`Takeaways\` appear later, under "Questions people
actually ask." \`Compare\` appears under "Three ways to see your draft," and
\`Steps\`/\`Scrolly\` under "Getting a block onto the page" - each one doing
its actual job in context, rather than being demonstrated twice.

### Technical

Seven blocks for writing about code and systems, including the newest one on
this page - a real diagram, not a static image export:

<Mermaid caption="How a block gets from a slash command to a published page">

\`\`\`mermaid
graph LR
  A["/ menu"] --> B[Lexical node]
  B --> C[mdast]
  C --> D[MDX text]
  D -->|re-opened| B
  C -->|Astro/Blog| E[Published HTML]
\`\`\`

</Mermaid>

<CodeWalk steps={[{ lines: "1", title: "Parse", text: "Markdown and Imaxt JSX become one mdast tree." }, { lines: "2", title: "Bridge", text: "Each mdast node maps onto a Lexical node, one-to-one." }, { lines: "3", title: "Serialize", text: "It all writes back out to MDX, losslessly." }]}>

\`\`\`ts
const tree = fromMarkdown(source, PARSE_OPTIONS);
const doc = mdxToBlocks(tree);
\`\`\`

</CodeWalk>

CodeWalk pairs a code sample with a numbered gloss - each callout points at
a line range instead of repeating the code inline.

Terminal looks like a code block but is actually structured data - each
line is tagged as a prompt, a command, or output, so it can be styled and
read differently:

<Terminal title="Installing the library" lines={[{ prompt: "$", command: "npm install @inflate-ai/imaxt-core @inflate-ai/imaxt-mdx" }, { output: "added 2 packages in 1.2s" }]} />

<Diff before=".prose .imx-bars {
  list-style: none;
}" after=".imx-bars {
  list-style: none;
}" lang="css" />

Diff is the real fix from this page's own CSS: nine block types had their
layout rules gated behind a \`.prose\` ancestor class the editor never
provides - removing that prefix is the entire fix.

<ErrorBox title="Component not found" message="No renderer is registered for <Foo> - the tag stays in the MDX untouched, but nothing shows on the page yet." stack="at renderBlock (packages/editor/src/blocks/renderBlock.ts:12)" />

ErrorBox is what a host site shows (or could show) for a block it doesn't
recognize yet - the MDX itself is never lost, just unrendered until that
site adds the matching component.

<Changelog entries={[{ version: "0.9.0", date: "2026-10", items: ["Added the Mermaid block, rendered client-side and themed from Imaxt's own tone tokens", "Raw mode now grows with its content instead of scrolling inside a fixed-height box", "Fixed a systemic CSS bug that broke spacing on nine block types outside Blog's own article wrapper"] }]} />

Changelog groups a version's changes under one heading - the structured
version of the paragraph you're reading right now.

<FileTree tree={[{ name: "packages", children: [{ name: "core" }, { name: "mdx" }, { name: "editor" }, { name: "editor-demo" }, { name: "astro" }] }]} />

FileTree draws a folder structure as nested text - here, the same monorepo
this page's own code lives in.

### Visual & Motion

The smallest, loudest category - five blocks meant for a cover or a section
break, not a whole article:

<Marquee tone="rose" words={["Ticker", "Banner", "CurvedText", "TypeLab", "Marquee"]} />

Marquee scrolls a list of short words across the full width - a banner for a
cover, not for running text.

#### Why TypeLab exists

Imaxt's whole premise is that typography *is* the interface - no images, no
icons. That's a claim worth letting a reader check for themselves, not just
take on faith. TypeLab is a live type specimen: drag a variable font's actual
weight, width, or optical-size axis, change the size or line-height, and copy
the resulting CSS straight out. It's most useful in a post that is *about*
type or a design system - not something every article needs, which is why
it's filed under Visual & Motion rather than Typography.

<TypeLab sample="Same letters, different voice" family="fraunces" />

<Ticker phrases={["Typography", "Data & Stats", "Narrative", "Technical", "Visual & Motion", "Media"]} seconds={3} tone="rose" />

Ticker cycles through a list of phrases one at a time, in place - a rotating
headline rather than Marquee's continuous scroll, and it holds still for
anyone who prefers reduced motion.

<CurvedText text="IMAXT" shape="circle" mark="®" tone="accent" spin={true} />

CurvedText bends a short piece of text along an arc, a wave, or a full
circle - a decorative, display-scale flourish, not something you'd set a
whole sentence in.

\`Banner\`, the fifth Visual & Motion block, shows up next, in "Tones, not
stock photos" - the section it's actually built to prove a point for.

### Media

Just one block - a plain, honest link card for anything that lives
elsewhere: a video, a talk, a repository.

<Embed url="https://github.com/Inflate-AI/Imaxt" caption="This repository" />

## Tones, not stock photos

Every tone-aware block reads from the same seven presets - \`mint\`, \`lilac\`,
\`sky\`, \`rose\`, \`accent\`, \`ink\`, \`white\` - or a literal \`#rrggbb\` custom
color, with a readable text color chosen for you automatically either way.
In dark mode the pastel presets become deep jewel tones instead of staying
light with swapped text, so nothing here ever goes illegible:

<StatRow>
  <Stat value={7} label="preset tones" tone="mint" />
  <Stat value={1} label="custom color option" tone="lilac" />
  <Stat value={2} label="themes, handled automatically" tone="sky" />
</StatRow>

<Banner text="Readable in light or dark, always" tone="rose" />

## Three ways to see your draft

<Compare>

  <Side kind="before" label="Write">
    The block-based editor you're looking at right now - live previews,
    inline forms, drag to reorder.
  </Side>

  <Side label="Render">
    The exact HTML a published page would show. Same classes, same CSS as
    Write mode - the only difference is nothing here is editable.
  </Side>

</Compare>

Raw mode is the third: the same document as plain MDX text, free-scrolling
like the other two modes instead of boxed into a fixed-height input.

## Getting a block onto the page

<Steps>

  <Step title="Press slash">
    Open the insert menu on any empty line.
  </Step>

  <Step title="Search or browse">
    All 41 blocks are grouped by category and visible from the start - search
    narrows by block name or by category, like "data" or "narrative".
  </Step>

  <Step title="Fill in the form">
    Each block gets a small, generated form. The live preview updates as you
    type.
  </Step>

</Steps>

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

## Questions people actually ask

<Faq items={[{ q: "Can I write plain Markdown with zero Imaxt blocks?", a: "Yes - Imaxt is a complete plain-Markdown editor on its own. Every block here is optional." }, { q: "What happens to a block a host site doesn't render yet?", a: "It stays in the MDX as a normal component tag - nothing is lost, it just won't render visually until that site adds the matching component, the same case ErrorBox describes above." }, { q: "Do tones really adapt to dark mode on their own?", a: "Yes - the color values are CSS custom properties, redeclared for dark mode once, not per block." }]} />

<Checklist title="Before you start writing" items={[{ text: "Try the Raw/Write/Render switch above", done: false }, { text: "Insert one Data & Stats block", done: false }, { text: "Insert one Narrative block", done: false }]} />

<Takeaways title="The short version" items={["One document model for prose and data - no separate preview step", "41 blocks across six categories, all reachable from \`/\`, every one of them shown live on this page", "Tones - preset or custom - stay readable automatically, in any theme"]} />

<Callout kind="tip" title="Your turn">
  Press *slash* anywhere below this line and start writing.
</Callout>
`;
