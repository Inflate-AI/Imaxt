import { type ChecklistData, type ChecklistItem, renderChecklist } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class ChecklistTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Checklist' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: ChecklistData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<ChecklistData> }) {
    this.data = { items: data.items ?? [{ text: '' }], title: data.title };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderChecklist(this.data);
  }

  private renderItem(item: ChecklistItem, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const doneCheckbox = document.createElement('input');
    doneCheckbox.type = 'checkbox';
    doneCheckbox.checked = Boolean(item.done);
    doneCheckbox.addEventListener('change', () => {
      item.done = doneCheckbox.checked;
      onChange();
    });

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Item';
    textInput.value = item.text;
    textInput.addEventListener('input', () => {
      item.text = textInput.value;
      onChange();
    });

    row.append(doneCheckbox, textInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-checklist';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title (optional)';
    titleInput.value = this.data.title ?? '';
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<ChecklistItem>({
      items: this.data.items,
      createItem: () => ({ text: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add item',
    });

    wrapper.append(titleInput, list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): ChecklistData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: ChecklistData): boolean {
    return savedData.items.length > 0;
  }
}
