import { escapeHtml } from './shared.ts';

export interface FileTreeNode {
  name: string;
  children?: FileTreeNode[];
}

export interface FileTreeData {
  tree: FileTreeNode[];
}

function renderNode(node: FileTreeNode): string {
  const isFolder = node.children !== undefined;
  const name = escapeHtml(node.name) + (isFolder ? '/' : '');
  const children = isFolder
    ? `<ul class="imx-tree-children">${(node.children ?? []).map(renderNode).join('')}</ul>`
    : '';
  return (
    `<li class="imx-tree-node" data-kind="${isFolder ? 'folder' : 'file'}">` +
    `<span class="imx-tree-name">${name}</span>${children}</li>`
  );
}

export function renderFileTree(data: FileTreeData): string {
  const items = data.tree.map(renderNode).join('');
  return `<div class="imx"><ul class="imx-tree">${items}</ul></div>`;
}
