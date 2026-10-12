// Standard Markdown block content: mdast <-> Lexical. Imaxt blocks are a
// separate top-level dispatch (see document.ts) - this module only ever
// sees paragraph/heading/list/table/blockquote/code/image, the same set
// any plain Markdown editor needs.
import { $createCodeNode, $isCodeNode, type CodeNode } from '@lexical/code';
import {
  $createListItemNode,
  $createListNode,
  $isListNode,
  type ListItemNode,
  type ListNode,
  type ListType,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  type TableCellNode,
} from '@lexical/table';
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isTextNode,
  type LexicalNode,
} from 'lexical';
import type { BlockContent, Heading, Image, List, ListItem, Table } from 'mdast';
import { $createImageNode, $isImageNode, type ImageNode } from '../nodes/ImageNode.tsx';
import { lexicalToPhrasing, phrasingToLexical } from './inline.ts';

export const SUPPORTED_MARKDOWN_BLOCK_TYPES = [
  'paragraph',
  'heading',
  'list',
  'blockquote',
  'code',
  'table',
] as const;

// ---------- mdast -> Lexical ----------

function soleImageOf(node: { type: string; children?: unknown[] }): Image | null {
  if (node.type !== 'paragraph' || node.children?.length !== 1) return null;
  const child = node.children[0] as { type: string };
  return child.type === 'image' ? (child as unknown as Image) : null;
}

export function markdownBlockToLexical(node: BlockContent): LexicalNode {
  const image = soleImageOf(node);
  if (image) {
    return $createImageNode({ ref: image.url, alt: image.alt ?? '', title: image.title });
  }

  switch (node.type) {
    case 'paragraph': {
      const p = $createParagraphNode();
      for (const child of phrasingToLexical(node.children)) p.append(child);
      return p;
    }
    case 'heading': {
      const h = $createHeadingNode(`h${node.depth}` as `h${1 | 2 | 3 | 4 | 5 | 6}`);
      for (const child of phrasingToLexical(node.children)) h.append(child);
      return h;
    }
    case 'blockquote': {
      const quote = $createQuoteNode();
      node.children.forEach((child, i) => {
        if (i > 0) quote.append($createLineBreakNode());
        if (child.type === 'paragraph') {
          for (const inline of phrasingToLexical(child.children)) quote.append(inline);
        }
      });
      return quote;
    }
    case 'code': {
      const code = $createCodeNode(node.lang ?? undefined);
      const lines = node.value.split('\n');
      lines.forEach((line, i) => {
        if (i > 0) code.append($createLineBreakNode());
        code.append($createTextNode(line));
      });
      return code;
    }
    case 'list':
      return listToLexical(node);
    case 'table':
      return tableToLexical(node);
    default:
      throw new Error(
        `imaxt-editor: unsupported markdown block "${(node as { type: string }).type}"`,
      );
  }
}

function listToLexical(node: List): ListNode {
  const items = node.children;
  const isCheckList = items.some((item) => item.checked !== null && item.checked !== undefined);
  const listType: ListType = isCheckList ? 'check' : node.ordered ? 'number' : 'bullet';
  const list = $createListNode(listType, node.start ?? 1);
  for (const item of items) list.append(listItemToLexical(item));
  return list;
}

function listItemToLexical(node: ListItem): ListItemNode {
  const li = $createListItemNode(node.checked ?? undefined);
  for (const child of node.children) {
    if (child.type === 'paragraph') {
      for (const inline of phrasingToLexical(child.children)) li.append(inline);
    } else if (child.type === 'list') {
      li.append(listToLexical(child));
    }
  }
  return li;
}

function tableToLexical(node: Table) {
  const table = $createTableNode();
  node.children.forEach((row, rowIndex) => {
    const tableRow = $createTableRowNode();
    for (const cell of row.children) {
      const headerState =
        rowIndex === 0 ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;
      const tableCell = $createTableCellNode(headerState);
      const p = $createParagraphNode();
      for (const inline of phrasingToLexical(cell.children)) p.append(inline);
      tableCell.append(p);
      tableRow.append(tableCell);
    }
    table.append(tableRow);
  });
  return table;
}

// ---------- Lexical -> mdast ----------

export function lexicalToMarkdownBlock(node: LexicalNode): BlockContent {
  if ($isImageNode(node)) {
    const image = node as ImageNode;
    return {
      type: 'paragraph',
      children: [
        { type: 'image', url: image.getRef(), alt: image.getAlt(), title: image.getTitle() },
      ],
    };
  }
  if ($isParagraphNode(node)) {
    return { type: 'paragraph', children: lexicalToPhrasing(node.getChildren()) };
  }
  if ($isHeadingNode(node)) {
    const depth = Number(node.getTag().slice(1)) as Heading['depth'];
    return { type: 'heading', depth, children: lexicalToPhrasing(node.getChildren()) };
  }
  if ($isQuoteNode(node)) {
    const inline: LexicalNode[] = [];
    const paragraphs: unknown[] = [];
    for (const child of node.getChildren()) {
      if ($isLineBreakNode(child)) {
        paragraphs.push({ type: 'paragraph', children: lexicalToPhrasing(inline) });
        inline.length = 0;
      } else {
        inline.push(child);
      }
    }
    paragraphs.push({ type: 'paragraph', children: lexicalToPhrasing(inline) });
    return { type: 'blockquote', children: paragraphs as never };
  }
  if ($isCodeNode(node)) {
    const code = node as CodeNode;
    const value = code
      .getChildren()
      .map((child) =>
        $isLineBreakNode(child) ? '\n' : $isTextNode(child) ? child.getTextContent() : '',
      )
      .join('');
    return { type: 'code', lang: code.getLanguage() ?? null, meta: null, value };
  }
  if ($isListNode(node)) return listToMdast(node);
  if ($isTableNode(node)) return tableToMdast(node);
  throw new Error(`imaxt-editor: unsupported Lexical block node "${node.getType()}"`);
}

function listToMdast(list: ListNode): List {
  const ordered = list.getListType() === 'number';
  return {
    type: 'list',
    ordered,
    start: ordered ? list.getStart() : null,
    spread: false,
    children: list.getChildren().map((item) => listItemToMdast(item as ListItemNode)),
  };
}

function listItemToMdast(item: ListItemNode): ListItem {
  const inlineChildren: LexicalNode[] = [];
  const blockChildren: unknown[] = [];
  for (const child of item.getChildren()) {
    if ($isListNode(child)) blockChildren.push(listToMdast(child));
    else inlineChildren.push(child);
  }
  const children: unknown[] = [];
  if (inlineChildren.length > 0) {
    children.push({ type: 'paragraph', children: lexicalToPhrasing(inlineChildren) });
  }
  children.push(...blockChildren);
  return {
    type: 'listItem',
    checked: item.getChecked() ?? null,
    spread: false,
    children: children as never,
  };
}

function tableToMdast(table: ReturnType<typeof $createTableNode>): Table {
  return {
    type: 'table',
    align: [],
    children: table.getChildren().map((row) => {
      if (!$isTableRowNode(row)) throw new Error('imaxt-editor: table row expected');
      return {
        type: 'tableRow',
        children: row.getChildren().map((cell) => {
          if (!$isTableCellNode(cell)) throw new Error('imaxt-editor: table cell expected');
          const [content] = (cell as TableCellNode).getChildren();
          const inline = content && $isElementNode(content) ? content.getChildren() : [];
          return { type: 'tableCell', children: lexicalToPhrasing(inline) };
        }),
      };
    }),
  } as never;
}
