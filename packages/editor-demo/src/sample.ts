export const SAMPLE_DOCUMENT = `# What Imaxt actually is

<Statement tone="mint" align="center">
  Imaxt is typography that argues **its own case** - numbers, diagrams, and asides rendered as real text, not screenshots.
</Statement>

Imaxt is a library of **41 blocks** for Markdown/MDX articles, grouped into six
categories below. Every one of them renders as real HTML - selectable,
themeable, readable by a screen reader - styled almost entirely through type
and color, the same way this sentence is. None of them are images.

<PullQuote by="Imaxt's own design note">
  If a chart can be a sentence instead, make it a sentence.
</PullQuote>

Every block on this page was inserted the same way: press \`/\` on an empty
line, search, pick a block, fill in its fields. There is one document model
underneath all of it, so writing a paragraph and inserting a \`<Scorecard>\`
are not two different modes - they're just the next line.

## The six categories

<Matrix rows={["Typography", "Data & Stats", "Narrative", "Technical", "Visual & Motion", "Media"]} cols={["Blocks", "What it's for"]} cells={[["9", "making a sentence or a term carry more weight"], ["10", "numbers and comparisons as real text"], ["9", "structuring how a reader moves through an argument"], ["7", "writing about code and systems"], ["5", "decorative, display-scale typography"], ["1", "linking out"]]} caption="41 blocks, six jobs" />

### Typography

<Sidenote label="What lives here">
  Statement, PullQuote, Sidenote, DropCap, Redacted, Stamp, Footnote, Glossary,
  and Formula. Nine blocks whose only job is making one sentence, one term, or
  one equation carry more weight than the paragraph around it.
</Sidenote>

<DropCap tone="accent">
  Open a section with a DropCap, cite a source with a Footnote, define a term
  with Glossary, typeset an equation with Formula - each one does a single,
  small typographic job well, instead of one block trying to do all of them.
</DropCap>

### Data & Stats

Ten blocks turn a number into something you can actually read, not a
screenshot of a chart:

<Bars unit=" blocks" tone="sky" items={[{ label: "Typography", value: 9 }, { label: "Data & Stats", value: 10 }, { label: "Narrative", value: 9 }, { label: "Technical", value: 7 }, { label: "Visual & Motion", value: 5 }, { label: "Media", value: 1 }]} />

<Delta label="A dashboard screenshot, vs." from="one PNG, uneditable" to="one Scorecard, real text" tone="accent" />

\`<Scorecard>\`, \`<Gauge>\`, \`<Sparkline>\`, \`<Funnel>\`, \`<Heatmap>\`, \`<StatRow>\`,
\`<Bars>\`, \`<Ranked>\`, \`<Delta>\`, and \`<Matrix>\` (used twice already on this
page) all live here.

### Narrative

<Callout kind="tip" title="Structure, not decoration">
  Callout, FAQ, Takeaways, Checklist, Versus, Compare, Steps, Timeline, and
  Scrolly don't decorate a sentence - they structure the article itself: a
  side-by-side, a sequence, a question a reader actually has.
</Callout>

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

The same six blocks Blog's own build already used - Terminal, Diff, ErrorBox,
Changelog, CodeWalk, FileTree - plus Mermaid, now wired up the same way every
other interactive block is: render instantly, then render for real once the
diagram library loads.

<CodeWalk steps={[{ lines: "1", title: "Parse", text: "Markdown and Imaxt JSX become one mdast tree." }, { lines: "2", title: "Bridge", text: "Each mdast node maps onto a Lexical node, one-to-one." }, { lines: "3", title: "Serialize", text: "It all writes back out to MDX, losslessly." }]}>

\`\`\`ts
const tree = fromMarkdown(source, PARSE_OPTIONS);
const doc = mdxToBlocks(tree);
\`\`\`

</CodeWalk>

### Visual & Motion

The smallest, loudest category - five blocks meant for a cover or a section
break, not a whole article:

<Marquee tone="rose" words={["Ticker", "Banner", "CurvedText", "TypeLab", "Marquee"]} />

#### Why TypeLab exists

Imaxt's whole premise is that typography *is* the interface - no images, no
icons. That's a claim worth letting a reader check for themselves, not just
take on faith. TypeLab is a live type specimen: drag a variable font's actual
weight, width, or optical-size axis, change the size or line-height, and copy
the resulting CSS straight out. It's most useful in a post that is *about*
type or a design system - not something every article needs, which is why
it's filed under Visual & Motion rather than Typography.

<TypeLab sample="Same letters, different voice" family="fraunces" />

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
  <Stat value="7" label="preset tones" tone="mint" />
  <Stat value="1" label="custom color option" tone="lilac" />
  <Stat value="2" label="themes, handled automatically" tone="sky" />
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

<Faq items={[{ q: "Can I write plain Markdown with zero Imaxt blocks?", a: "Yes - Imaxt is a complete plain-Markdown editor on its own. Every block here is optional." }, { q: "What happens to a block a host site doesn't render yet?", a: "It stays in the MDX as a normal component tag - nothing is lost, it just won't render visually until that site adds the matching component." }, { q: "Do tones really adapt to dark mode on their own?", a: "Yes - the color values are CSS custom properties, redeclared for dark mode once, not per block." }]} />

<Checklist title="Before you start writing" items={[{ text: "Try the Raw/Write/Render switch above", done: false }, { text: "Insert one Data & Stats block", done: false }, { text: "Insert one Narrative block", done: false }]} />

<Takeaways title="The short version" items={["One document model for prose and data - no separate preview step", "41 blocks across six categories, all reachable from \`/\`", "Tones - preset or custom - stay readable automatically, in any theme"]} />

<Callout kind="tip" title="Your turn">
  Press *slash* anywhere below this line and start writing.
</Callout>
`;
