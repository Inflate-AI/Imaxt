// This codec is deliberately editor-private. It implements Imaxt's established
// MDX component syntax at the editor boundary; it is not a generic MDX compiler.
import type { PhrasingContent } from 'mdast';
import type { ImaxtBlock } from '../../core/document.ts';
import { escapeHtml } from '../../core/shared.ts';

type MdxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value?: string | { type: 'mdxJsxAttributeValueExpression'; value: string } | null;
};

type MdxElement = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string | null;
  attributes: MdxAttribute[];
  children: unknown[];
};

const COMPONENT_TYPES = {
  Statement: 'statement',
  PullQuote: 'pull-quote',
  Sidenote: 'sidenote',
  Bars: 'bars',
  Ranked: 'ranked',
  Matrix: 'matrix',
  Delta: 'delta',
  Gauge: 'gauge',
  Scorecard: 'scorecard',
  Sparkline: 'sparkline',
  Funnel: 'funnel',
  Callout: 'callout',
  Faq: 'faq',
  Takeaways: 'takeaways',
  Footnote: 'footnote',
  Glossary: 'glossary',
  Versus: 'versus',
  Checklist: 'checklist',
  Terminal: 'terminal',
  Diff: 'diff',
  FileTree: 'file-tree',
  ErrorBox: 'error-box',
  Changelog: 'changelog',
  Formula: 'formula',
  Ticker: 'ticker',
  DropCap: 'drop-cap',
  Redacted: 'redacted',
  Stamp: 'stamp',
  Banner: 'banner',
  Marquee: 'marquee',
  Heatmap: 'heatmap',
  CurvedText: 'curved-text',
  TypeLab: 'type-lab',
  StatRow: 'stat-row',
  Compare: 'compare',
  Steps: 'steps',
  Timeline: 'timeline',
  Scrolly: 'scrolly',
  CodeWalk: 'code-walk',
  Embed: 'embed',
  Mermaid: 'mermaid',
} as const satisfies Record<string, ImaxtBlock['type']>;

const HTML_COMPONENTS = new Set([
  'Statement',
  'PullQuote',
  'Sidenote',
  'Callout',
  'Footnote',
  'DropCap',
  'Redacted',
]);
const EXPRESSION_ATTRIBUTES = new Set([
  'items',
  'max',
  'rows',
  'cols',
  'cells',
  'from',
  'to',
  'value',
  'values',
  'stages',
  'lines',
  'tree',
  'entries',
  'display',
  'seconds',
  'angle',
  'data',
  'min',
  'spin',
  'decorative',
  'steps',
]);

function isElement(node: unknown): node is MdxElement {
  const type = (node as { type?: string } | undefined)?.type;
  return type === 'mdxJsxFlowElement' || type === 'mdxJsxTextElement';
}

function unwrapSoleJsxChild(node: unknown): unknown {
  const paragraph = node as { type?: string; children?: unknown[] };
  return paragraph.type === 'paragraph' && paragraph.children?.length === 1
    ? paragraph.children[0]
    : node;
}

function attr(element: MdxElement, name: string): unknown {
  const value = element.attributes.find((attribute) => attribute.name === name)?.value;
  if (typeof value === 'string') return value;
  return value && typeof value === 'object' ? parseJsLiteral(value.value) : undefined;
}

function attributes(element: MdxElement): Record<string, unknown> {
  return Object.fromEntries(
    element.attributes.map((attribute) => [attribute.name, attr(element, attribute.name)]),
  );
}

function elements(element: MdxElement, name: string): MdxElement[] {
  return element.children.filter(
    (child): child is MdxElement => isElement(child) && child.name === name,
  );
}

function htmlFromChildren(children: unknown[]): string {
  const phrasing = children.flatMap((child) => {
    const node = child as { type?: string; children?: PhrasingContent[] };
    return node.type === 'paragraph' ? (node.children ?? []) : [];
  });
  return phrasingToHtml(phrasing);
}

/** Converts one recognized MDX JSX node into its editor block, or returns null. */
export function mdastNodeToImaxtBlock(node: unknown): ImaxtBlock | null {
  const element = unwrapSoleJsxChild(node);
  if (!isElement(element) || !element.name || !(element.name in COMPONENT_TYPES)) return null;
  const type = COMPONENT_TYPES[element.name as keyof typeof COMPONENT_TYPES];
  const data = attributes(element);

  if (HTML_COMPONENTS.has(element.name)) data.html = htmlFromChildren(element.children);
  switch (element.name) {
    case 'StatRow':
      data.items = elements(element, 'Stat').map((stat) => attributes(stat));
      break;
    case 'Compare':
      data.sides = elements(element, 'Side').map((side) => ({
        ...attributes(side),
        html: htmlFromChildren(side.children),
      }));
      break;
    case 'Steps':
      data.items = elements(element, 'Step').map((step) => ({
        ...attributes(step),
        html: htmlFromChildren(step.children),
      }));
      break;
    case 'Timeline':
      data.items = elements(element, 'Event').map((event) => ({
        ...attributes(event),
        html: htmlFromChildren(event.children),
      }));
      break;
    case 'Scrolly':
      data.items = elements(element, 'Beat').map((beat) => ({
        ...attributes(beat),
        html: htmlFromChildren(beat.children),
      }));
      break;
    case 'CodeWalk':
    case 'Mermaid': {
      const code = element.children.find((child) => (child as { type?: string }).type === 'code') as
        | { value?: string }
        | undefined;
      data[element.name === 'CodeWalk' ? 'code' : 'source'] = code?.value ?? '';
      break;
    }
  }
  return { type, data } as ImaxtBlock;
}

function jsxElement(
  name: string,
  attributes: MdxAttribute[] = [],
  children: unknown[] = [],
): MdxElement {
  return { type: 'mdxJsxFlowElement', name, attributes, children };
}

function jsxAttributes(
  data: Record<string, unknown>,
  omit: readonly string[] = [],
): MdxAttribute[] {
  return Object.entries(data).flatMap<MdxAttribute>(([name, value]) => {
    if (omit.includes(name) || value === undefined || value === false) return [];
    if (typeof value === 'string' && !EXPRESSION_ATTRIBUTES.has(name)) {
      return [{ type: 'mdxJsxAttribute', name, value }];
    }
    return [
      {
        type: 'mdxJsxAttribute',
        name,
        value: { type: 'mdxJsxAttributeValueExpression', value: stringifyJsLiteral(value) },
      },
    ];
  });
}

function htmlChildren(html: string): unknown[] {
  const children = htmlToPhrasing(html);
  return children.length ? [{ type: 'paragraph', children }] : [];
}

/** Converts one editor block into the exact MDX component vocabulary Imaxt already uses. */
export function imaxtBlockToMdastNode(block: ImaxtBlock): unknown {
  const data = block.data as unknown as Record<string, unknown>;
  const name = Object.entries(COMPONENT_TYPES).find(([, type]) => type === block.type)?.[0];
  if (!name) throw new Error(`imaxt-editor: unsupported Imaxt block "${block.type}"`);

  if (HTML_COMPONENTS.has(name)) {
    return jsxElement(name, jsxAttributes(data, ['html']), htmlChildren(String(data.html ?? '')));
  }
  switch (block.type) {
    case 'stat-row':
      return jsxElement(
        'StatRow',
        [],
        (data.items as Record<string, unknown>[]).map((item) =>
          jsxElement('Stat', jsxAttributes(item)),
        ),
      );
    case 'compare':
      return jsxElement(
        'Compare',
        [],
        (data.sides as Record<string, unknown>[]).map((side) =>
          jsxElement('Side', jsxAttributes(side, ['html']), htmlChildren(String(side.html ?? ''))),
        ),
      );
    case 'steps':
      return jsxElement(
        'Steps',
        [],
        (data.items as Record<string, unknown>[]).map((item) =>
          jsxElement('Step', jsxAttributes(item, ['html']), htmlChildren(String(item.html ?? ''))),
        ),
      );
    case 'timeline':
      return jsxElement(
        'Timeline',
        [],
        (data.items as Record<string, unknown>[]).map((item) =>
          jsxElement('Event', jsxAttributes(item, ['html']), htmlChildren(String(item.html ?? ''))),
        ),
      );
    case 'scrolly':
      return jsxElement(
        'Scrolly',
        jsxAttributes(data, ['items']),
        (data.items as Record<string, unknown>[]).map((item) =>
          jsxElement('Beat', jsxAttributes(item, ['html']), htmlChildren(String(item.html ?? ''))),
        ),
      );
    case 'code-walk':
      return jsxElement('CodeWalk', jsxAttributes(data, ['code']), [
        { type: 'code', lang: null, value: String(data.code ?? '') },
      ]);
    case 'mermaid':
      return jsxElement('Mermaid', jsxAttributes(data, ['source']), [
        { type: 'code', lang: 'mermaid', value: String(data.source ?? '') },
      ]);
    default:
      return jsxElement(name, jsxAttributes(data));
  }
}

function phrasingToHtml(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return escapeHtml(node.value);
      if (node.type === 'break') return '<br>';
      if (node.type === 'strong') return `<strong>${phrasingToHtml(node.children)}</strong>`;
      if (node.type === 'emphasis') return `<em>${phrasingToHtml(node.children)}</em>`;
      return '';
    })
    .join('');
}

function htmlToPhrasing(html: string): PhrasingContent[] {
  const root: PhrasingContent[] = [];
  const stack: PhrasingContent[][] = [root];
  const tag = /<(\/?)(strong|b|em|i|br)\s*\/?>/gi;
  let last = 0;
  const text = (value: string) =>
    value.replace(
      /&(amp|lt|gt|quot|apos);/g,
      (_, entity: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[entity] ?? '',
    );
  for (const match of html.matchAll(tag)) {
    const value = text(html.slice(last, match.index));
    if (value) stack.at(-1)?.push({ type: 'text', value });
    const closing = match[1];
    const name = match[2]?.toLowerCase();
    if (name === 'br') stack.at(-1)?.push({ type: 'break' });
    else if (closing) stack.pop();
    else {
      const children: PhrasingContent[] = [];
      stack.at(-1)?.push({
        type: name === 'strong' || name === 'b' ? 'strong' : 'emphasis',
        children,
      } as PhrasingContent);
      stack.push(children);
    }
    last = match.index + match[0].length;
  }
  const value = text(html.slice(last));
  if (value) stack.at(-1)?.push({ type: 'text', value });
  return root;
}

// The existing format accepts data-only JavaScript literals in JSX attributes.
// Parse only that grammar; never evaluate author-provided source.
class LiteralReader {
  position = 0;
  constructor(readonly source: string) {}
  skip() {
    while (/\s/.test(this.source[this.position] ?? '')) this.position++;
  }
  peek() {
    this.skip();
    return this.source[this.position] ?? '';
  }
  next() {
    this.skip();
    return this.source[this.position++] ?? '';
  }
  raw() {
    return this.source[this.position++] ?? '';
  }
  word(test: (character: string) => boolean) {
    let value = '';
    while (test(this.source[this.position] ?? '')) value += this.source[this.position++];
    return value;
  }
}

function parseJsLiteral(source: string): unknown {
  const reader = new LiteralReader(source);
  const value = parseLiteralValue(reader);
  if (reader.peek()) throw new Error(`Unexpected trailing content in MDX attribute: "${source}"`);
  return value;
}

function parseLiteralValue(reader: LiteralReader): unknown {
  const character = reader.peek();
  if (character === '"' || character === "'" || character === '`')
    return parseLiteralString(reader);
  if (character === '[') {
    reader.next();
    const values: unknown[] = [];
    while (reader.peek() !== ']') {
      values.push(parseLiteralValue(reader));
      if (reader.peek() === ',') reader.next();
    }
    reader.next();
    return values;
  }
  if (character === '{') {
    reader.next();
    const value: Record<string, unknown> = {};
    while (reader.peek() !== '}') {
      const key =
        reader.peek() === '"' || reader.peek() === "'"
          ? parseLiteralString(reader)
          : reader.word((c) => /[\w$]/.test(c));
      if (reader.next() !== ':') throw new Error('Expected object attribute separator');
      value[key] = parseLiteralValue(reader);
      if (reader.peek() === ',') reader.next();
    }
    reader.next();
    return value;
  }
  if (character === '-' || /\d/.test(character))
    return Number(reader.word((c) => /[0-9eE+\-.]/.test(c)));
  const keyword = reader.word((c) => /[a-z]/i.test(c));
  if (keyword === 'true') return true;
  if (keyword === 'false') return false;
  if (keyword === 'null') return null;
  throw new Error(`Unsupported MDX attribute literal: "${keyword}"`);
}

function parseLiteralString(reader: LiteralReader): string {
  const quote = reader.next();
  let value = '';
  for (;;) {
    const character = reader.raw();
    if (!character) throw new Error('Unterminated MDX attribute string');
    if (character === quote) return value;
    if (character !== '\\') {
      value += character;
      continue;
    }
    const escaped = reader.raw();
    if (escaped === 'u')
      value += String.fromCharCode(
        Number.parseInt(`${reader.raw()}${reader.raw()}${reader.raw()}${reader.raw()}`, 16),
      );
    else
      value +=
        { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' }[escaped] ?? escaped;
  }
}

function stringifyJsLiteral(value: unknown): string {
  if (value === null || typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stringifyJsLiteral).join(', ')}]`;
  if (typeof value === 'object')
    return `{ ${Object.entries(value as Record<string, unknown>)
      .map(
        ([key, item]) =>
          `${/^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${stringifyJsLiteral(item)}`,
      )
      .join(', ')} }`;
  throw new Error(`Cannot serialize ${typeof value} as an MDX attribute`);
}
