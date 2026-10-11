import { type RankedData, type RankedItem, renderRanked } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class RankedTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Ranked' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: RankedData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<RankedData> }) {
    this.data = {
      items: data.items ?? [{ label: '' }],
      unit: data.unit,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderRanked(this.data);
  }

  private renderItem(item: RankedItem, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label';
    labelInput.value = item.label;
    labelInput.addEventListener('input', () => {
      item.label = labelInput.value;
      onChange();
    });

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Value';
    valueInput.value = item.value ?? '';
    valueInput.addEventListener('input', () => {
      item.value = valueInput.value || undefined;
      onChange();
    });

    const deltaInput = document.createElement('input');
    deltaInput.type = 'text';
    deltaInput.placeholder = 'Delta (number, new, same)';
    deltaInput.value = item.delta === undefined ? '' : String(item.delta);
    deltaInput.addEventListener('input', () => {
      const raw = deltaInput.value.trim();
      if (raw === '') item.delta = undefined;
      else if (raw === 'new' || raw === 'same') item.delta = raw;
      else item.delta = Number(raw);
      onChange();
    });

    row.append(labelInput, valueInput, deltaInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-ranked';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<RankedItem>({
      items: this.data.items,
      createItem: () => ({ label: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add item',
    });

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): RankedData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: RankedData): boolean {
    return savedData.items.length > 0;
  }
}
