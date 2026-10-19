import { $createCodeNode, $isCodeNode, type CodeNode } from '@lexical/code';
import {
  $createListItemNode,
  $createListNode,
  $isListNode,
  type ListItemNode,
  type ListNode,
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

function soleImageOf(node: { type: string; children?: unknown[] }): Image | null {
  if (node.type !== 'paragraph' || node.children?.length !== 1) return null;
  const child = node.children[0] as { type: string };
  return child.type === 'image' ? (child as unknown as Image) : null;
}

export function markdownBlockToLexical(node: BlockContent): LexicalNode {
  const image = soleImageOf(node);
  if (image) return $createImageNode({ ref: image.url, alt: image.alt ?? '', title: image.title });
  switch (node.type) {
    case 'paragraph': {
      const paragraph = $createParagraphNode();
      for (const child of phrasingToLexical(node.children)) paragraph.append(child);
      return paragraph;
    }
    case 'heading': {
      const heading = $createHeadingNode(`h${node.depth}` as `h${1 | 2 | 3 | 4 | 5 | 6}`);
      for (const child of phrasingToLexical(node.children)) heading.append(child);
      return heading;
    }
    case 'blockquote': {
      const quote = $createQuoteNode();
      node.children.forEach((child, index) => {
        if (index > 0) quote.append($createLineBreakNode());
        if (child.type === 'paragraph') {
          for (const inline of phrasingToLexical(child.children)) quote.append(inline);
        }
      });
      return quote;
    }
    case 'code': {
      const code = $createCodeNode(node.lang ?? undefined);
      node.value.split('\n').forEach((line, index) => {
        if (index > 0) code.append($createLineBreakNode());
        code.append($createTextNode(line));
      });
      return code;
    }
    case 'list':
      return listToLexical(node);
    case 'table':
      return tableToLexical(node);
    default:
      throw new Error(`imaxt-editor: unsupported markdown block "${node.type}"`);
  }
}

function listToLexical(node: List): ListNode {
  const isChecklist = node.children.some(
    (item) => item.checked !== null && item.checked !== undefined,
  );
  const list = $createListNode(
    isChecklist ? 'check' : node.ordered ? 'number' : 'bullet',
    node.start ?? 1,
  );
  for (const item of node.children) list.append(listItemToLexical(item));
  return list;
}

function listItemToLexical(node: ListItem): ListItemNode {
  const item = $createListItemNode(node.checked ?? undefined);
  for (const child of node.children) {
    if (child.type === 'paragraph') {
      for (const inline of phrasingToLexical(child.children)) item.append(inline);
    } else if (child.type === 'list') {
      item.append(listToLexical(child));
    }
  }
  return item;
}

function tableToLexical(node: Table) {
  const table = $createTableNode();
  node.children.forEach((row, rowIndex) => {
    const tableRow = $createTableRowNode();
    for (const cell of row.children) {
      const header = rowIndex === 0 ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;
      const tableCell = $createTableCellNode(header);
      const paragraph = $createParagraphNode();
      for (const inline of phrasingToLexical(cell.children)) paragraph.append(inline);
      tableCell.append(paragraph);
      tableRow.append(tableCell);
    }
    table.append(tableRow);
  });
  return table;
}

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
  if ($isParagraphNode(node))
    return { type: 'paragraph', children: lexicalToPhrasing(node.getChildren()) };
  if ($isHeadingNode(node))
    return {
      type: 'heading',
      depth: Number(node.getTag().slice(1)) as Heading['depth'],
      children: lexicalToPhrasing(node.getChildren()),
    };
  if ($isQuoteNode(node)) {
    const paragraphs: unknown[] = [];
    let inline: LexicalNode[] = [];
    for (const child of node.getChildren()) {
      if ($isLineBreakNode(child)) {
        paragraphs.push({ type: 'paragraph', children: lexicalToPhrasing(inline) });
        inline = [];
      } else inline.push(child);
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
  const inline: LexicalNode[] = [];
  const nested: unknown[] = [];
  for (const child of item.getChildren()) {
    if ($isListNode(child)) nested.push(listToMdast(child));
    else inline.push(child);
  }
  const children: unknown[] = inline.length
    ? [{ type: 'paragraph', children: lexicalToPhrasing(inline) }]
    : [];
  children.push(...nested);
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
          return {
            type: 'tableCell',
            children:
              content && $isElementNode(content) ? lexicalToPhrasing(content.getChildren()) : [],
          };
        }),
      };
    }),
  } as never;
}
