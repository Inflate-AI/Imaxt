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
import { imaxtBlockToMdastNode, mdastNodeToImaxtBlock } from './mdx.ts';

const PARSE_OPTIONS = {
  extensions: [mdxjs(), gfm()],
  mdastExtensions: [mdxFromMarkdown(), gfmFromMarkdown()],
};

function unwrapSoleJsxChild(node: unknown): unknown {
  const paragraph = node as { type?: string; children?: unknown[] };
  return paragraph.type === 'paragraph' && paragraph.children?.length === 1
    ? paragraph.children[0]
    : node;
}

/** Loads standard Markdown/GFM and Imaxt's established MDX block syntax into Lexical. */
export function parseDocumentIntoEditor(editor: LexicalEditor, source: string): void {
  const tree = fromMarkdown(source, PARSE_OPTIONS as never) as unknown as { children: unknown[] };
  editor.update(
    () => {
      const root = $getRoot();
      root.clear();
      for (const node of tree.children) {
        const block = mdastNodeToImaxtBlock(unwrapSoleJsxChild(node));
        root.append(
          block ? $createImaxtBlockNode(block) : markdownBlockToLexical(node as BlockContent),
        );
      }
      if (root.getChildrenSize() === 0) {
        root.append(markdownBlockToLexical({ type: 'paragraph', children: [] }));
      }
    },
    { discrete: true },
  );
}

/** Serializes the current Lexical document to the editor's MDX/Markdown persistence format. */
export function serializeEditorToDocument(editor: LexicalEditor): string {
  let children: unknown[] = [];
  editor.getEditorState().read(() => {
    children = $getRoot()
      .getChildren()
      .map((node: LexicalNode) =>
        $isImaxtBlockNode(node)
          ? imaxtBlockToMdastNode(node.getBlock())
          : lexicalToMarkdownBlock(node),
      );
  });
  return toMarkdown(
    { type: 'root', children } as never,
    { bullet: '-', extensions: [mdxToMarkdown(), gfmToMarkdown()] } as never,
  );
}
