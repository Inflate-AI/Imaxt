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
