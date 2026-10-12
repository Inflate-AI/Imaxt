// Inline (phrasing) content: mdast <-> Lexical, independent of which block
// they're nested in (paragraph, heading, list item, table cell, blockquote).
import { $createLinkNode, $isLinkNode, type LinkNode } from '@lexical/link';
import {
  $createTextNode,
  $isTextNode,
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  type LexicalNode,
} from 'lexical';
import type { PhrasingContent } from 'mdast';

export function phrasingToLexical(nodes: readonly PhrasingContent[]): LexicalNode[] {
  const out: LexicalNode[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        out.push($createTextNode(node.value));
        break;
      case 'strong':
        for (const child of phrasingToLexical(node.children)) {
          if ($isTextNode(child)) child.setFormat(child.getFormat() | IS_BOLD);
          out.push(child);
        }
        break;
      case 'emphasis':
        for (const child of phrasingToLexical(node.children)) {
          if ($isTextNode(child)) child.setFormat(child.getFormat() | IS_ITALIC);
          out.push(child);
        }
        break;
      case 'delete':
        for (const child of phrasingToLexical(node.children)) {
          if ($isTextNode(child)) child.setFormat(child.getFormat() | IS_STRIKETHROUGH);
          out.push(child);
        }
        break;
      case 'inlineCode': {
        const t = $createTextNode(node.value);
        t.setFormat(t.getFormat() | IS_CODE);
        out.push(t);
        break;
      }
      case 'link': {
        const link = $createLinkNode(node.url, node.title ? { title: node.title } : undefined);
        for (const child of phrasingToLexical(node.children)) link.append(child);
        out.push(link);
        break;
      }
      case 'break':
        // A hard line break inside a paragraph; represented as its own text
        // node so it round-trips through plain getTextContent() concatenation.
        out.push($createTextNode('\n'));
        break;
      default:
        throw new Error(`imaxt-editor: unsupported inline markdown node "${node.type}"`);
    }
  }
  return out;
}

export function lexicalToPhrasing(nodes: readonly LexicalNode[]): PhrasingContent[] {
  const out: PhrasingContent[] = [];
  for (const node of nodes) {
    if ($isTextNode(node)) {
      const format = node.getFormat();
      let wrapped: PhrasingContent;
      if (format & IS_CODE) {
        wrapped = { type: 'inlineCode', value: node.getTextContent() };
      } else {
        wrapped = { type: 'text', value: node.getTextContent() };
      }
      if (format & IS_BOLD) wrapped = { type: 'strong', children: [wrapped] };
      if (format & IS_ITALIC) wrapped = { type: 'emphasis', children: [wrapped] };
      if (format & IS_STRIKETHROUGH) wrapped = { type: 'delete', children: [wrapped] };
      out.push(wrapped);
    } else if ($isLinkNode(node)) {
      const link = node as LinkNode;
      out.push({
        type: 'link',
        url: link.getURL(),
        title: link.getTitle() ?? null,
        children: lexicalToPhrasing(link.getChildren()),
      });
    } else {
      throw new Error(`imaxt-editor: unsupported inline Lexical node "${node.getType()}"`);
    }
  }
  return out;
}
