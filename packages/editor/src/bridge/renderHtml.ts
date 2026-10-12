// Renders the live Lexical document to the same HTML a published page would
// show. Imaxt blocks go through imaxt-core's own render functions
// (renderBlockPreview) - the same ones Blog/Prox use - so Render Mode is
// never a lookalike, it's the real output. Standard Markdown nodes are
// rendered with the *exact* classes `theme/lexicalTheme.ts` assigns Lexical's
// own DOM (and `.imx-ed-block` wraps Imaxt blocks the same way
// `ImaxtBlockNode.createDOM` does) so Render Mode's markup is identical to
// Write mode's, styled by the same `editor.css` rules - the only difference
// is this one is static HTML, not a live contentEditable tree.
import { escapeHtml } from '@inflate-ai/imaxt-core';
import { $isCodeNode, type CodeNode } from '@lexical/code';
import { $isLinkNode, type LinkNode } from '@lexical/link';
import { $isListItemNode, $isListNode, type ListItemNode, type ListNode } from '@lexical/list';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import {
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  type TableCellNode,
} from '@lexical/table';
import {
  $getRoot,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isTextNode,
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';
import { renderBlockPreview } from '../blocks/renderBlock.ts';
import type { ImageStorageAdapter } from '../image/adapter.ts';
import { $isImageNode, type ImageNode } from '../nodes/ImageNode.tsx';
import { $isImaxtBlockNode } from '../nodes/ImaxtBlockNode.tsx';

function inlineHtml(nodes: readonly LexicalNode[]): string {
  return nodes
    .map((node) => {
      if ($isLineBreakNode(node)) return '<br>';
      if ($isTextNode(node)) {
        const format = node.getFormat();
        let html = escapeHtml(node.getTextContent());
        if (format & IS_CODE) html = `<code class="imx-ed-inline-code">${html}</code>`;
        if (format & IS_BOLD) html = `<strong class="imx-ed-bold">${html}</strong>`;
        if (format & IS_ITALIC) html = `<em class="imx-ed-italic">${html}</em>`;
        if (format & IS_STRIKETHROUGH) html = `<s class="imx-ed-strikethrough">${html}</s>`;
        return html;
      }
      if ($isLinkNode(node)) {
        const link = node as LinkNode;
        return `<a class="imx-ed-link" href="${escapeHtml(link.getURL())}">${inlineHtml(link.getChildren())}</a>`;
      }
      return '';
    })
    .join('');
}

function listHtml(list: ListNode): string {
  const tag = list.getListType() === 'number' ? 'ol' : 'ul';
  const cls = tag === 'ol' ? 'imx-ed-ol' : 'imx-ed-ul';
  const items = list
    .getChildren()
    .filter($isListItemNode)
    .map((item) => listItemHtml(item))
    .join('');
  return `<${tag} class="${cls}">${items}</${tag}>`;
}

function listItemHtml(item: ListItemNode): string {
  const inline: LexicalNode[] = [];
  const nestedLists: string[] = [];
  for (const child of item.getChildren()) {
    if ($isListNode(child)) nestedLists.push(listHtml(child));
    else inline.push(child);
  }
  const checked = item.getChecked();
  // Lexical's own checklist items render as a plain <li> with a CSS-only
  // checkbox (no literal <input>) via imx-ed-li-checked/unchecked - match
  // that exactly rather than inventing a different (and non-interactive,
  // confusingly so) <input> here.
  const cls =
    checked === undefined ? 'imx-ed-li' : checked ? 'imx-ed-li-checked' : 'imx-ed-li-unchecked';
  return `<li class="${cls}">${inlineHtml(inline)}${nestedLists.join('')}</li>`;
}

function renderTable(node: LexicalNode): string {
  if (!$isTableNode(node)) return '';
  // Lexical's own TableNode DOM is a flat <table><tr>...</tr></table> - no
  // thead/tbody grouping - so this matches that structure exactly instead
  // of inferring a header section from the first row.
  const rows = node
    .getChildren()
    .filter($isTableRowNode)
    .map((row) => {
      const cells = row
        .getChildren()
        .filter($isTableCellNode)
        .map((cell) => {
          const isHeader = (cell as TableCellNode).hasHeaderState(TableCellHeaderStates.ROW);
          const tag = isHeader ? 'th' : 'td';
          const cls = isHeader ? 'imx-ed-table-cell-header' : 'imx-ed-table-cell';
          const [content] = cell.getChildren();
          const inline = content && $isElementNode(content) ? content.getChildren() : [];
          return `<${tag} class="${cls}">${inlineHtml(inline)}</${tag}>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    });
  return `<table class="imx-ed-table">${rows.join('')}</table>`;
}

function blockquoteHtml(node: LexicalNode): string {
  if (!$isElementNode(node)) return '';
  return `<blockquote class="imx-ed-quote">${inlineHtml(node.getChildren())}</blockquote>`;
}

function codeHtml(node: CodeNode): string {
  const language = node.getLanguage();
  const classAttr = language ? ` language-${escapeHtml(language)}` : '';
  const text = node
    .getChildren()
    .map((child) =>
      $isLineBreakNode(child) ? '\n' : $isTextNode(child) ? child.getTextContent() : '',
    )
    .join('');
  // A single block-level <code>, matching Lexical's own CodeNode DOM
  // (CodeNode.createDOM is a bare <code>, never wrapped in <pre>).
  return `<code class="imx-ed-code${classAttr}">${escapeHtml(text)}</code>`;
}

function imageHtml(node: ImageNode, imageAdapter: ImageStorageAdapter): string {
  const resolved = imageAdapter.resolve(node.getRef());
  const src = typeof resolved === 'string' ? resolved : node.getRef();
  const title = node.getTitle();
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<span class="imx-ed-image"><img src="${escapeHtml(src)}" alt="${escapeHtml(node.getAlt())}"${titleAttr}></span>`;
}

function blockHtml(node: LexicalNode, imageAdapter: ImageStorageAdapter): string {
  if ($isImaxtBlockNode(node)) {
    return `<div class="imx-ed-block">${renderBlockPreview(node.getBlock())}</div>`;
  }
  if ($isImageNode(node)) return imageHtml(node, imageAdapter);
  if ($isParagraphNode(node)) return `<p class="imx-ed-p">${inlineHtml(node.getChildren())}</p>`;
  if ($isHeadingNode(node)) {
    const tag = node.getTag();
    return `<${tag} class="imx-ed-${tag}">${inlineHtml(node.getChildren())}</${tag}>`;
  }
  if ($isQuoteNode(node)) return blockquoteHtml(node);
  if ($isCodeNode(node)) return codeHtml(node as CodeNode);
  if ($isListNode(node)) return listHtml(node);
  if ($isTableNode(node)) return renderTable(node);
  return '';
}

/** Renders the current document to publish-ready HTML - standard Markdown as the same classed tags Write mode's own contentEditable uses, Imaxt blocks via their real render functions. */
export function renderEditorToHtml(
  editor: LexicalEditor,
  imageAdapter: ImageStorageAdapter,
): string {
  let html = '';
  editor.getEditorState().read(() => {
    html = $getRoot()
      .getChildren()
      .map((node) => blockHtml(node, imageAdapter))
      .join('\n');
  });
  return html;
}
