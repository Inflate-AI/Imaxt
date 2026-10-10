import { escapeHtml } from '@inflate-ai/imaxt-core';
import type { Break, Emphasis, PhrasingContent, Strong, Text } from 'mdast';

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeEntities(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|apos);/g, (_, name: string) => ENTITIES[name] ?? '');
}

const TAG = /<(\/?)(strong|b|em|i|br)\s*\/?>/gi;
const WRAPPING_TAG: Record<string, 'strong' | 'emphasis'> = {
  strong: 'strong',
  b: 'strong',
  em: 'emphasis',
  i: 'emphasis',
};

/**
 * Parses the small inline-markup subset Imaxt's "rich text" block fields allow (matching the
 * sanitize config every EditorJS tool declares: b/strong/i/em/br) into mdast phrasing content,
 * so it can be embedded as real children in the MDX tree.
 */
export function htmlToPhrasing(html: string): PhrasingContent[] {
  const root: PhrasingContent[] = [];
  const stack: PhrasingContent[][] = [root];
  let lastIndex = 0;

  const flushText = (end: number) => {
    if (end > lastIndex) {
      const value = decodeEntities(html.slice(lastIndex, end));
      if (value) stack[stack.length - 1]?.push({ type: 'text', value } satisfies Text);
    }
  };

  for (const match of html.matchAll(TAG)) {
    flushText(match.index);
    const [, closing, tagName] = match;
    const tag = tagName?.toLowerCase() ?? '';
    if (tag === 'br') {
      stack[stack.length - 1]?.push({ type: 'break' } satisfies Break);
    } else if (closing) {
      stack.pop();
    } else {
      const children: PhrasingContent[] = [];
      const node: Strong | Emphasis = { type: WRAPPING_TAG[tag] ?? 'strong', children } as
        | Strong
        | Emphasis;
      stack[stack.length - 1]?.push(node);
      stack.push(children);
    }
    lastIndex = match.index + match[0].length;
  }
  flushText(html.length);
  return root;
}

/** The inverse of {@link htmlToPhrasing}: mdast phrasing content back to that same HTML subset. */
export function phrasingToHtml(nodes: PhrasingContent[]): string {
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
