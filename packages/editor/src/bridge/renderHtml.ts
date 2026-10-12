// Renders the live Lexical document to the same HTML a published page would
// show: standard Markdown nodes become plain semantic HTML, Imaxt blocks go
// through imaxt-core's own render functions (renderBlockPreview) - the same
// ones Blog/Prox use - so Render Mode is never a lookalike, it's the real
// output.
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
        if (format & IS_CODE) html = `<code>${html}</code>`;
        if (format & IS_BOLD) html = `<strong>${html}</strong>`;
        if (format & IS_ITALIC) html = `<em>${html}</em>`;
        if (format & IS_STRIKETHROUGH) html = `<s>${html}</s>`;
        return html;
      }
      if ($isLinkNode(node)) {
        const link = node as LinkNode;
        return `<a href="${escapeHtml(link.getURL())}">${inlineHtml(link.getChildren())}</a>`;
      }
      return '';
    })
    .join('');
}

function listHtml(list: ListNode): string {
  const tag = list.getListType() === 'number' ? 'ol' : 'ul';
  const items = list
    .getChildren()
    .filter($isListItemNode)
    .map((item) => listItemHtml(item))
    .join('');
  return `<${tag}>${items}</${tag}>`;
}

function listItemHtml(item: ListItemNode): string {
  const inline: LexicalNode[] = [];
  const nestedLists: string[] = [];
  for (const child of item.getChildren()) {
    if ($isListNode(child)) nestedLists.push(listHtml(child));
    else inline.push(child);
  }
  const checked = item.getChecked();
  const checkbox =
    checked === undefined ? '' : `<input type="checkbox" disabled ${checked ? 'checked' : ''}> `;
  return `<li>${checkbox}${inlineHtml(inline)}${nestedLists.join('')}</li>`;
}

function renderTable(node: LexicalNode): string {
  if (!$isTableNode(node)) return '';
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
          const [content] = cell.getChildren();
          const inline = content && $isElementNode(content) ? content.getChildren() : [];
          return `<${tag}>${inlineHtml(inline)}</${tag}>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    });
  const [headRow, ...bodyRows] = rows;
  return `<table><thead>${headRow ?? ''}</thead><tbody>${bodyRows.join('')}</tbody></table>`;
}

function blockquoteHtml(node: LexicalNode): string {
  if (!$isElementNode(node)) return '';
  return `<blockquote>${inlineHtml(node.getChildren())}</blockquote>`;
}

function codeHtml(node: CodeNode): string {
  const language = node.getLanguage();
  const classAttr = language ? ` class="language-${escapeHtml(language)}"` : '';
  const text = node
    .getChildren()
    .map((child) =>
      $isLineBreakNode(child) ? '\n' : $isTextNode(child) ? child.getTextContent() : '',
    )
    .join('');
  return `<pre><code${classAttr}>${escapeHtml(text)}</code></pre>`;
}

function imageHtml(node: ImageNode, imageAdapter: ImageStorageAdapter): string {
  const resolved = imageAdapter.resolve(node.getRef());
  const src = typeof resolved === 'string' ? resolved : node.getRef();
  const title = node.getTitle();
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(node.getAlt())}"${titleAttr}>`;
}

function blockHtml(node: LexicalNode, imageAdapter: ImageStorageAdapter): string {
  if ($isImaxtBlockNode(node)) return renderBlockPreview(node.getBlock());
  if ($isImageNode(node)) return imageHtml(node, imageAdapter);
  if ($isParagraphNode(node)) return `<p>${inlineHtml(node.getChildren())}</p>`;
  if ($isHeadingNode(node)) {
    const tag = node.getTag();
    return `<${tag}>${inlineHtml(node.getChildren())}</${tag}>`;
  }
  if ($isQuoteNode(node)) return blockquoteHtml(node);
  if ($isCodeNode(node)) return codeHtml(node as CodeNode);
  if ($isListNode(node)) return listHtml(node);
  if ($isTableNode(node)) return renderTable(node);
  return '';
}

/** Renders the current document to publish-ready HTML - standard Markdown as plain tags, Imaxt blocks via their real render functions. */
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
