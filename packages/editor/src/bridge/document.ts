// The top-level document bridge: every root-level mdast node is either a
// recognized Imaxt block (an MDX-JSX element imaxt-mdx already knows how to
// convert) or a standard Markdown block - both live on the same Lexical
// document, inserted through the same slash menu, with no "mode" switch.
import { blockToMdastNode, mdastNodeToBlock } from '@inflate-ai/imaxt-mdx';
import { $getRoot, type LexicalEditor, type LexicalNode } from 'lexical';
import type { BlockContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfm } from 'micromark-extension-gfm';
import { mdxjs } from 'micromark-extension-mdxjs';
import { $createImaxtBlockNode, $isImaxtBlockNode } from '../nodes/ImaxtBlockNode.tsx';
import { lexicalToMarkdownBlock, markdownBlockToLexical } from './blocks.ts';

const PARSE_OPTIONS = {
  extensions: [mdxjs(), gfm()],
  mdastExtensions: [mdxFromMarkdown(), gfmFromMarkdown()],
};

/** A paragraph whose sole inline child is an unrecognized JSX element unwraps to that element - mirrors imaxt-mdx's own from-mdx.ts convention for single-line JSX authoring. */
function unwrapSoleJsxChild(node: unknown): unknown {
  const paragraph = node as { type?: string; children?: unknown[] };
  if (paragraph.type === 'paragraph' && paragraph.children?.length === 1) {
    return paragraph.children[0];
  }
  return node;
}

/** Parses MDX/Markdown source into a Lexical document: builds Imaxt block nodes for recognized components, standard Lexical nodes for everything else. */
export function parseDocumentIntoEditor(editor: LexicalEditor, source: string): void {
  const tree = fromMarkdown(source, PARSE_OPTIONS as never) as unknown as { children: unknown[] };

  editor.update(
    () => {
      const root = $getRoot();
      root.clear();
      for (const node of tree.children) {
        const unwrapped = unwrapSoleJsxChild(node);
        const imaxtBlock = mdastNodeToBlock(unwrapped);
        if (imaxtBlock) {
          root.append($createImaxtBlockNode(imaxtBlock));
        } else {
          root.append(markdownBlockToLexical(node as BlockContent));
        }
      }
      if (root.getChildrenSize() === 0) {
        root.append(markdownBlockToLexical({ type: 'paragraph', children: [] }));
      }
    },
    { discrete: true },
  );
}

/** Serializes the current Lexical document back to MDX/Markdown source. */
export function serializeEditorToDocument(editor: LexicalEditor): string {
  let children: unknown[] = [];
  editor.getEditorState().read(() => {
    const root = $getRoot();
    children = root.getChildren().map((node: LexicalNode) => {
      if ($isImaxtBlockNode(node)) return blockToMdastNode(node.getBlock());
      return lexicalToMarkdownBlock(node);
    });
  });
  return toMarkdown(
    { type: 'root', children } as never,
    { bullet: '-', extensions: [mdxToMarkdown(), gfmToMarkdown()] } as never,
  );
}
