import type { Block } from '@inflate-ai/imaxt-mdx';
import {
  $getNodeByKey,
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import type { JSX } from 'react';
import { ImaxtBlockEditor } from '../blocks/ImaxtBlockEditor.tsx';

export type SerializedImaxtBlockNode = Spread<{ block: Block }, SerializedLexicalNode>;

/** Wraps one Imaxt block (Statement, Callout, Matrix, ...) as a single editable unit. */
export class ImaxtBlockNode extends DecoratorNode<JSX.Element> {
  __block: Block;

  static getType(): string {
    return 'imx-block';
  }

  static clone(node: ImaxtBlockNode): ImaxtBlockNode {
    return new ImaxtBlockNode(node.__block, node.__key);
  }

  static importJSON(serialized: SerializedImaxtBlockNode): ImaxtBlockNode {
    return new ImaxtBlockNode(serialized.block);
  }

  exportJSON(): SerializedImaxtBlockNode {
    return { type: 'imx-block', version: 1, block: this.__block };
  }

  constructor(block: Block, key?: NodeKey) {
    super(key);
    this.__block = block;
  }

  getBlock(): Block {
    return this.getLatest().__block;
  }

  setBlock(block: Block): void {
    this.getWritable().__block = block;
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const el = document.createElement('div');
    el.className = 'imx-ed-block';
    return el;
  }

  updateDOM(): boolean {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  decorate(editor: LexicalEditor): JSX.Element {
    const key = this.getKey();
    return (
      <ImaxtBlockEditor
        block={this.getBlock()}
        onChange={(block) => {
          editor.update(() => {
            const node = $getNodeByKey(key);
            if (node instanceof ImaxtBlockNode) node.setBlock(block);
          });
        }}
      />
    );
  }
}

export function $createImaxtBlockNode(block: Block): ImaxtBlockNode {
  return new ImaxtBlockNode(block);
}

export function $isImaxtBlockNode(node: LexicalNode | null | undefined): node is ImaxtBlockNode {
  return node instanceof ImaxtBlockNode;
}
