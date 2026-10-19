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
  const output: LexicalNode[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        output.push($createTextNode(node.value));
        break;
      case 'strong':
      case 'emphasis':
      case 'delete': {
        const format =
          node.type === 'strong'
            ? IS_BOLD
            : node.type === 'emphasis'
              ? IS_ITALIC
              : IS_STRIKETHROUGH;
        for (const child of phrasingToLexical(node.children)) {
          if ($isTextNode(child)) child.setFormat(child.getFormat() | format);
          output.push(child);
        }
        break;
      }
      case 'inlineCode': {
        const text = $createTextNode(node.value);
        text.setFormat(text.getFormat() | IS_CODE);
        output.push(text);
        break;
      }
      case 'link': {
        const link = $createLinkNode(node.url, node.title ? { title: node.title } : undefined);
        for (const child of phrasingToLexical(node.children)) link.append(child);
        output.push(link);
        break;
      }
      case 'break':
        output.push($createTextNode('\n'));
        break;
      default:
        throw new Error(`imaxt-editor: unsupported inline markdown node "${node.type}"`);
    }
  }
  return output;
}

export function lexicalToPhrasing(nodes: readonly LexicalNode[]): PhrasingContent[] {
  const output: PhrasingContent[] = [];
  for (const node of nodes) {
    if ($isTextNode(node)) {
      const format = node.getFormat();
      let content: PhrasingContent =
        format & IS_CODE
          ? { type: 'inlineCode', value: node.getTextContent() }
          : { type: 'text', value: node.getTextContent() };
      if (format & IS_BOLD) content = { type: 'strong', children: [content] };
      if (format & IS_ITALIC) content = { type: 'emphasis', children: [content] };
      if (format & IS_STRIKETHROUGH) content = { type: 'delete', children: [content] };
      output.push(content);
    } else if ($isLinkNode(node)) {
      const link = node as LinkNode;
      output.push({
        type: 'link',
        url: link.getURL(),
        title: link.getTitle() ?? null,
        children: lexicalToPhrasing(link.getChildren()),
      });
    } else {
      throw new Error(`imaxt-editor: unsupported inline Lexical node "${node.getType()}"`);
    }
  }
  return output;
}
