import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import type { Klass, LexicalNode } from 'lexical';
import { ImageNode } from './ImageNode.tsx';
import { ImaxtBlockNode } from './ImaxtBlockNode.tsx';

export const EDITOR_NODES: ReadonlyArray<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  CodeNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  ImageNode,
  ImaxtBlockNode,
];

export { $createImageNode, $isImageNode, ImageNode } from './ImageNode.tsx';
export { $createImaxtBlockNode, $isImaxtBlockNode, ImaxtBlockNode } from './ImaxtBlockNode.tsx';
