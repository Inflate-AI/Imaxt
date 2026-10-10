import { type BarItem, type BarsData, renderBars } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class BarsTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Bars' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: BarsData;
  private preview: HTMLElement | null = null;
  private list: HTMLElement | null = null;

  constructor({ data }: { data: Partial<BarsData> }) {
    this.data = {
      items: data.items ?? [{ label: '', value: 0 }],
      unit: data.unit,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderBars(this.data);
  }

  private renderItem(item: BarItem): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.dataset.field = 'label';
    labelInput.placeholder = 'Label';
    labelInput.value = item.label;
    labelInput.addEventListener('input', () => {
      item.label = labelInput.value;
      this.refresh();
    });

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.dataset.field = 'value';
    valueInput.value = String(item.value);
    valueInput.addEventListener('input', () => {
      item.value = Number(valueInput.value);
      this.refresh();
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'imx-ej-remove';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      this.data.items = this.data.items.filter((i) => i !== item);
      row.remove();
      this.refresh();
    });

    row.append(labelInput, valueInput, removeButton);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-bars';

    this.list = document.createElement('div');
    for (const item of this.data.items) this.list.append(this.renderItem(item));

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'imx-ej-add';
    addButton.textContent = 'Add bar';
    addButton.addEventListener('click', () => {
      const item: BarItem = { label: '', value: 0 };
      this.data.items.push(item);
      this.list?.append(this.renderItem(item));
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(this.list, addButton, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): BarsData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: BarsData): boolean {
    return savedData.items.length > 0;
  }
}
