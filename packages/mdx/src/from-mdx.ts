import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { mdxjs } from 'micromark-extension-mdxjs';
import { parse as parseYaml } from 'yaml';
import type { Block, ImaxtDocument } from './blocks.ts';
import { phrasingToHtml } from './html-phrasing.ts';
import {
  flattenToPhrasing,
  getExprAttr,
  getStringAttr,
  isMdxJsxElement,
  type MdxJsxElement,
} from './jsx-node.ts';

function html(element: MdxJsxElement): string {
  return phrasingToHtml(flattenToPhrasing(element.children));
}

function childElements(element: MdxJsxElement, name: string): MdxJsxElement[] {
  return element.children.filter(
    (child): child is MdxJsxElement => isMdxJsxElement(child) && child.name === name,
  );
}

function elementToBlock(element: MdxJsxElement): Block | null {
  switch (element.name) {
    case 'Statement':
      return {
        type: 'statement',
        data: {
          html: html(element),
          tone: getStringAttr(element, 'tone'),
          align: getStringAttr(element, 'align') as 'left' | 'center' | undefined,
          wide: getExprAttr(element, 'wide') === true ? true : undefined,
          bleed: getExprAttr(element, 'bleed') === true ? true : undefined,
        },
      };
    case 'PullQuote':
      return {
        type: 'pull-quote',
        data: { html: html(element), by: getStringAttr(element, 'by') },
      };
    case 'Sidenote':
      return {
        type: 'sidenote',
        data: { html: html(element), label: getStringAttr(element, 'label') },
      };
    case 'Bars':
      return {
        type: 'bars',
        data: {
          items: getExprAttr(element, 'items') as never,
          max: getExprAttr(element, 'max') as number | undefined,
          unit: getStringAttr(element, 'unit'),
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Ranked':
      return {
        type: 'ranked',
        data: {
          items: getExprAttr(element, 'items') as never,
          unit: getStringAttr(element, 'unit'),
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Matrix':
      return {
        type: 'matrix',
        data: {
          rows: getExprAttr(element, 'rows') as string[],
          cols: getExprAttr(element, 'cols') as string[],
          cells: getExprAttr(element, 'cells') as never,
          caption: getStringAttr(element, 'caption'),
        },
      };
    case 'Delta':
      return {
        type: 'delta',
        data: {
          label: getStringAttr(element, 'label') ?? '',
          from: getExprAttr(element, 'from') as string | number,
          to: getExprAttr(element, 'to') as string | number,
          unit: getStringAttr(element, 'unit'),
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Gauge':
      return {
        type: 'gauge',
        data: {
          value: getExprAttr(element, 'value') as number,
          max: getExprAttr(element, 'max') as number,
          label: getStringAttr(element, 'label'),
          unit: getStringAttr(element, 'unit'),
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Scorecard':
      return {
        type: 'scorecard',
        data: {
          items: getExprAttr(element, 'items') as never,
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Sparkline':
      return {
        type: 'sparkline',
        data: {
          values: getExprAttr(element, 'values') as number[],
          label: getStringAttr(element, 'label'),
        },
      };
    case 'Funnel':
      return {
        type: 'funnel',
        data: {
          stages: getExprAttr(element, 'stages') as never,
          unit: getStringAttr(element, 'unit'),
          tone: getStringAttr(element, 'tone'),
        },
      };
    case 'Marquee':
      return {
        type: 'marquee',
        data: {
          words: getExprAttr(element, 'words') as string[],
          tone: getStringAttr(element, 'tone'),
          seconds: getExprAttr(element, 'seconds') as number | undefined,
        },
      };
    case 'Heatmap':
      return {
        type: 'heatmap',
        data: {
          rows: getExprAttr(element, 'rows') as string[],
          cols: getExprAttr(element, 'cols') as string[],
          data: getExprAttr(element, 'data') as number[][],
          caption: getStringAttr(element, 'caption') ?? '',
          unit: getStringAttr(element, 'unit'),
          min: getExprAttr(element, 'min') as number | undefined,
          max: getExprAttr(element, 'max') as number | undefined,
        },
      };
    case 'CurvedText':
      return {
        type: 'curved-text',
        data: {
          text: getStringAttr(element, 'text') ?? '',
          shape: getStringAttr(element, 'shape') as never,
          mark: getStringAttr(element, 'mark'),
          tone: getStringAttr(element, 'tone'),
          spin: getExprAttr(element, 'spin') === true ? true : undefined,
          decorative: getExprAttr(element, 'decorative') === true ? true : undefined,
        },
      };
    case 'TypeLab':
      return {
        type: 'type-lab',
        data: {
          sample: getStringAttr(element, 'sample'),
          family: getStringAttr(element, 'family') as never,
        },
      };
    case 'StatRow':
      return {
        type: 'stat-row',
        data: {
          items: childElements(element, 'Stat').map((stat) => ({
            value: getExprAttr(stat, 'value') as string | number,
            unit: getStringAttr(stat, 'unit'),
            label: getStringAttr(stat, 'label') ?? '',
            note: getStringAttr(stat, 'note'),
            tone: getStringAttr(stat, 'tone'),
          })),
        },
      };
    case 'Compare': {
      const sides = childElements(element, 'Side').map((side) => ({
        html: html(side),
        label: getStringAttr(side, 'label'),
        kind: getStringAttr(side, 'kind') as 'before' | 'after' | undefined,
        tone: getStringAttr(side, 'tone'),
      }));
      return {
        type: 'compare',
        data: { sides: [sides[0] ?? { html: '' }, sides[1] ?? { html: '' }] },
      };
    }
    case 'Steps':
      return {
        type: 'steps',
        data: {
          items: childElements(element, 'Step').map((step) => ({
            title: getStringAttr(step, 'title') ?? '',
            html: html(step),
          })),
        },
      };
    case 'Timeline':
      return {
        type: 'timeline',
        data: {
          items: childElements(element, 'Event').map((event) => ({
            date: getStringAttr(event, 'date') ?? '',
            title: getStringAttr(event, 'title') ?? '',
            html: html(event),
          })),
        },
      };
    case 'Scrolly':
      return {
        type: 'scrolly',
        data: {
          tone: getStringAttr(element, 'tone'),
          items: childElements(element, 'Beat').map((beat) => ({
            stage: getStringAttr(beat, 'stage') ?? '',
            sub: getStringAttr(beat, 'sub'),
            html: html(beat),
          })),
        },
      };
    case 'CodeWalk': {
      const codeNode = element.children.find(
        (child): child is { type: 'code'; value: string } =>
          (child as { type?: string }).type === 'code',
      );
      return {
        type: 'code-walk',
        data: { code: codeNode?.value ?? '', steps: getExprAttr(element, 'steps') as never },
      };
    }
    default:
      return null;
  }
}

const PARSE_OPTIONS = {
  extensions: [mdxjs(), frontmatter(['yaml'])],
  mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown(['yaml'])],
};

function unwrapSoleJsxChild(node: unknown): unknown {
  const paragraph = node as { type?: string; children?: unknown[] };
  if (paragraph.type === 'paragraph' && paragraph.children?.length === 1) {
    return paragraph.children[0];
  }
  return node;
}

function stringifyFragment(nodes: unknown[]): string {
  return toMarkdown(
    { type: 'root', children: nodes } as never,
    {
      extensions: [mdxToMarkdown(), frontmatterToMarkdown(['yaml'])],
    } as never,
  ).trimEnd();
}

/** Parses MDX source into frontmatter plus a block list, recovering every recognized Imaxt component. */
export function mdxToBlocks(source: string): ImaxtDocument {
  const tree = fromMarkdown(source, PARSE_OPTIONS as never) as unknown as {
    children: unknown[];
  };

  let frontmatterData: Record<string, unknown> = {};
  let rest = tree.children;
  const first = rest[0] as { type?: string; value?: string } | undefined;
  if (first?.type === 'yaml' && typeof first.value === 'string') {
    frontmatterData = (parseYaml(first.value) as Record<string, unknown>) ?? {};
    rest = rest.slice(1);
  }

  const blocks: Block[] = [];
  let pending: unknown[] = [];
  const flushPending = () => {
    if (pending.length === 0) return;
    const text = stringifyFragment(pending);
    if (text.trim()) blocks.push({ type: 'markdown', source: text });
    pending = [];
  };

  for (const node of rest) {
    // A JSX element that is the sole content of its line parses as an inline (text) element
    // wrapped in a paragraph, not as its own flow element - unwrap that one case so single-line
    // and multi-line authoring of the same block are recognized identically.
    const unwrapped = unwrapSoleJsxChild(node);
    const block = isMdxJsxElement(unwrapped) ? elementToBlock(unwrapped) : null;
    if (block) {
      flushPending();
      blocks.push(block);
    } else {
      pending.push(node);
    }
  }
  flushPending();

  return { frontmatter: frontmatterData, blocks };
}
