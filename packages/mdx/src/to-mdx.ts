import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { stringify as stringifyYaml } from 'yaml';
import type { Block, ImaxtDocument } from './blocks.ts';
import { htmlToPhrasing } from './html-phrasing.ts';
import { exprAttr, jsxElement, paragraphChildren, stringAttr } from './jsx-node.ts';

function htmlChildren(html: string): unknown[] {
  return paragraphChildren(htmlToPhrasing(html));
}

function blockToNode(block: Block): unknown {
  switch (block.type) {
    case 'statement':
      return jsxElement(
        'Statement',
        [
          ...stringAttr('tone', block.data.tone),
          ...stringAttr('align', block.data.align),
          ...(block.data.wide ? exprAttr('wide', true) : []),
          ...(block.data.bleed ? exprAttr('bleed', true) : []),
        ],
        htmlChildren(block.data.html),
      );
    case 'pull-quote':
      return jsxElement(
        'PullQuote',
        stringAttr('by', block.data.by),
        htmlChildren(block.data.html),
      );
    case 'sidenote':
      return jsxElement(
        'Sidenote',
        stringAttr('label', block.data.label),
        htmlChildren(block.data.html),
      );
    case 'bars':
      return jsxElement('Bars', [
        ...exprAttr('items', block.data.items),
        ...(block.data.max !== undefined ? exprAttr('max', block.data.max) : []),
        ...stringAttr('unit', block.data.unit),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'ranked':
      return jsxElement('Ranked', [
        ...exprAttr('items', block.data.items),
        ...stringAttr('unit', block.data.unit),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'matrix':
      return jsxElement('Matrix', [
        ...exprAttr('rows', block.data.rows),
        ...exprAttr('cols', block.data.cols),
        ...exprAttr('cells', block.data.cells),
        ...stringAttr('caption', block.data.caption),
      ]);
    case 'delta':
      return jsxElement('Delta', [
        ...stringAttr('label', block.data.label),
        ...exprAttr('from', block.data.from),
        ...exprAttr('to', block.data.to),
        ...stringAttr('unit', block.data.unit),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'gauge':
      return jsxElement('Gauge', [
        ...exprAttr('value', block.data.value),
        ...exprAttr('max', block.data.max),
        ...stringAttr('label', block.data.label),
        ...stringAttr('unit', block.data.unit),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'scorecard':
      return jsxElement('Scorecard', [
        ...exprAttr('items', block.data.items),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'sparkline':
      return jsxElement('Sparkline', [
        ...exprAttr('values', block.data.values),
        ...stringAttr('label', block.data.label),
      ]);
    case 'funnel':
      return jsxElement('Funnel', [
        ...exprAttr('stages', block.data.stages),
        ...stringAttr('unit', block.data.unit),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'callout':
      return jsxElement(
        'Callout',
        [...stringAttr('kind', block.data.kind), ...stringAttr('title', block.data.title)],
        htmlChildren(block.data.html),
      );
    case 'faq':
      return jsxElement('Faq', exprAttr('items', block.data.items));
    case 'takeaways':
      return jsxElement('Takeaways', [
        ...exprAttr('items', block.data.items),
        ...stringAttr('title', block.data.title),
      ]);
    case 'footnote':
      return jsxElement(
        'Footnote',
        stringAttr('marker', block.data.marker),
        htmlChildren(block.data.html),
      );
    case 'glossary':
      return jsxElement('Glossary', exprAttr('items', block.data.items));
    case 'versus':
      return jsxElement('Versus', [
        ...exprAttr('sides', block.data.sides),
        ...stringAttr('vsLabel', block.data.vsLabel),
        ...stringAttr('tone', block.data.tone),
      ]);
    case 'checklist':
      return jsxElement('Checklist', [
        ...exprAttr('items', block.data.items),
        ...stringAttr('title', block.data.title),
      ]);
    case 'terminal':
      return jsxElement('Terminal', [
        ...exprAttr('lines', block.data.lines),
        ...stringAttr('title', block.data.title),
      ]);
    case 'diff':
      return jsxElement('Diff', [
        ...stringAttr('before', block.data.before),
        ...stringAttr('after', block.data.after),
        ...stringAttr('lang', block.data.lang),
      ]);
    case 'file-tree':
      return jsxElement('FileTree', exprAttr('tree', block.data.tree));
    case 'error-box':
      return jsxElement('ErrorBox', [
        ...stringAttr('title', block.data.title),
        ...stringAttr('message', block.data.message),
        ...stringAttr('stack', block.data.stack),
      ]);
    case 'changelog':
      return jsxElement('Changelog', exprAttr('entries', block.data.entries));
    case 'formula':
      return jsxElement('Formula', [
        ...stringAttr('tex', block.data.tex),
        ...(block.data.display ? exprAttr('display', true) : []),
        ...stringAttr('caption', block.data.caption),
      ]);
    case 'marquee':
      return jsxElement('Marquee', [
        ...exprAttr('words', block.data.words),
        ...stringAttr('tone', block.data.tone),
        ...(block.data.seconds !== undefined ? exprAttr('seconds', block.data.seconds) : []),
      ]);
    case 'heatmap':
      return jsxElement('Heatmap', [
        ...exprAttr('rows', block.data.rows),
        ...exprAttr('cols', block.data.cols),
        ...exprAttr('data', block.data.data),
        ...stringAttr('caption', block.data.caption),
        ...stringAttr('unit', block.data.unit),
        ...(block.data.min !== undefined ? exprAttr('min', block.data.min) : []),
        ...(block.data.max !== undefined ? exprAttr('max', block.data.max) : []),
      ]);
    case 'curved-text':
      return jsxElement('CurvedText', [
        ...stringAttr('text', block.data.text),
        ...stringAttr('shape', block.data.shape),
        ...stringAttr('mark', block.data.mark),
        ...stringAttr('tone', block.data.tone),
        ...(block.data.spin ? exprAttr('spin', true) : []),
        ...(block.data.decorative ? exprAttr('decorative', true) : []),
      ]);
    case 'type-lab':
      return jsxElement('TypeLab', [
        ...stringAttr('sample', block.data.sample),
        ...stringAttr('family', block.data.family),
      ]);
    case 'stat-row':
      return jsxElement(
        'StatRow',
        [],
        block.data.items.map((stat) =>
          jsxElement('Stat', [
            ...exprAttr('value', stat.value),
            ...stringAttr('unit', stat.unit),
            ...stringAttr('label', stat.label),
            ...stringAttr('note', stat.note),
            ...stringAttr('tone', stat.tone),
          ]),
        ),
      );
    case 'compare':
      return jsxElement(
        'Compare',
        [],
        block.data.sides.map((side) =>
          jsxElement(
            'Side',
            [
              ...stringAttr('label', side.label),
              ...stringAttr('kind', side.kind),
              ...stringAttr('tone', side.tone),
            ],
            htmlChildren(side.html),
          ),
        ),
      );
    case 'steps':
      return jsxElement(
        'Steps',
        [],
        block.data.items.map((step) =>
          jsxElement('Step', stringAttr('title', step.title), htmlChildren(step.html)),
        ),
      );
    case 'timeline':
      return jsxElement(
        'Timeline',
        [],
        block.data.items.map((event) =>
          jsxElement(
            'Event',
            [...stringAttr('date', event.date), ...stringAttr('title', event.title)],
            htmlChildren(event.html),
          ),
        ),
      );
    case 'scrolly':
      return jsxElement(
        'Scrolly',
        stringAttr('tone', block.data.tone),
        block.data.items.map((beat) =>
          jsxElement(
            'Beat',
            [...stringAttr('stage', beat.stage), ...stringAttr('sub', beat.sub)],
            htmlChildren(beat.html),
          ),
        ),
      );
    case 'code-walk':
      return jsxElement('CodeWalk', exprAttr('steps', block.data.steps), [
        { type: 'code', lang: null, value: block.data.code },
      ]);
    case 'markdown':
      return parseMarkdownFragment(block.source);
  }
}

function parseMarkdownFragment(source: string): unknown[] {
  const tree = fromMarkdown(source, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown()],
  });
  return tree.children;
}

/** Compiles EditorJS block data into MDX source, matching Imaxt's existing component syntax. */
export function blocksToMdx(doc: ImaxtDocument): string {
  const children: unknown[] = [];
  if (Object.keys(doc.frontmatter).length > 0) {
    children.push({ type: 'yaml', value: stringifyYaml(doc.frontmatter).trimEnd() });
  }
  for (const block of doc.blocks) {
    const node = blockToNode(block);
    if (Array.isArray(node)) children.push(...node);
    else children.push(node);
  }
  return toMarkdown(
    { type: 'root', children } as never,
    {
      extensions: [mdxToMarkdown(), frontmatterToMarkdown(['yaml'])],
    } as never,
  );
}
