import { renderTakeaways, type TakeawaysData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class TakeawaysTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Takeaways' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: TakeawaysData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<TakeawaysData> }) {
    this.data = { items: data.items ?? [''], title: data.title };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderTakeaways(this.data);
  }

  private renderItem(item: string, index: number, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Takeaway';
    input.value = item;
    input.addEventListener('input', () => {
      this.data.items[index] = input.value;
      onChange();
    });
    row.append(input);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-takeaways';

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

    const list = createRepeatableList<string>({
      items: this.data.items,
      createItem: () => '',
      renderItem: (item, onChange) => {
        const index = this.data.items.indexOf(item);
        return this.renderItem(item, index, onChange);
      },
      onChange: () => this.refresh(),
      addLabel: 'Add takeaway',
    });

    wrapper.append(titleInput, list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): TakeawaysData {
    return { ...this.data, items: [...this.data.items] };
  }

  validate(savedData: TakeawaysData): boolean {
    return savedData.items.length > 0;
  }
}
