import { type FileTreeData, type FileTreeNode, renderFileTree } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class FileTreeTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.grid, title: 'FileTree' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: FileTreeData;
  private preview: HTMLElement | null = null;
  private list: HTMLElement | null = null;

  constructor({ data }: { data: Partial<FileTreeData> }) {
    this.data = { tree: data.tree ?? [{ name: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderFileTree(this.data);
  }

  private renderNodeList(nodes: FileTreeNode[], onChange: () => void): HTMLElement {
    const list = document.createElement('div');
    list.className = 'imx-ej-list';

    const redraw = () => {
      list.innerHTML = '';
      for (const node of nodes) list.append(this.renderNode(node, nodes, onChange, redraw));
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'imx-ej-add';
      addButton.textContent = 'Add entry';
      addButton.addEventListener('click', () => {
        nodes.push({ name: '' });
        redraw();
        onChange();
      });
      list.append(addButton);
    };
    redraw();
    return list;
  }

  private renderNode(
    node: FileTreeNode,
    parent: FileTreeNode[],
    onChange: () => void,
    redrawParent: () => void,
  ): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    nameInput.value = node.name;
    nameInput.addEventListener('input', () => {
      node.name = nameInput.value;
      onChange();
    });

    const folderCheckbox = document.createElement('input');
    folderCheckbox.type = 'checkbox';
    folderCheckbox.checked = node.children !== undefined;
    folderCheckbox.addEventListener('change', () => {
      node.children = folderCheckbox.checked ? (node.children ?? []) : undefined;
      redrawParent();
      onChange();
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'imx-ej-remove';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      parent.splice(parent.indexOf(node), 1);
      redrawParent();
      onChange();
    });

    row.append(folderCheckbox, nameInput, removeButton);
    if (node.children !== undefined) {
      row.append(this.renderNodeList(node.children, onChange));
    }
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-filetree';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    this.list = this.renderNodeList(this.data.tree, () => this.refresh());

    wrapper.append(this.list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): FileTreeData {
    const clone = (nodes: FileTreeNode[]): FileTreeNode[] =>
      nodes.map((node) => ({
        name: node.name,
        ...(node.children !== undefined ? { children: clone(node.children) } : {}),
      }));
    return { tree: clone(this.data.tree) };
  }

  validate(savedData: FileTreeData): boolean {
    return savedData.tree.length > 0;
  }
}
