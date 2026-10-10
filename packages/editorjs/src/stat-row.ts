import { renderStatRow, type StatData, type StatRowData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

function renderStatItem(item: StatData, onChange: () => void, onRemove: () => void): HTMLElement {
  const row = document.createElement('div');

  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.dataset.field = 'value';
  valueInput.placeholder = 'Value';
  valueInput.value = String(item.value);
  valueInput.addEventListener('input', () => {
    item.value = valueInput.value;
    onChange();
  });

  const unitInput = document.createElement('input');
  unitInput.type = 'text';
  unitInput.placeholder = 'Unit (optional)';
  unitInput.value = item.unit ?? '';
  unitInput.addEventListener('input', () => {
    item.unit = unitInput.value;
    onChange();
  });

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Label';
  labelInput.value = item.label;
  labelInput.addEventListener('input', () => {
    item.label = labelInput.value;
    onChange();
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'imx-ej-remove';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', onRemove);

  const tonePicker = createTonePicker(item.tone, (tone) => {
    item.tone = tone;
    onChange();
  });

  row.append(valueInput, unitInput, labelInput, tonePicker, removeButton);
  return row;
}

export class StatRowTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Stat row' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: StatRowData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<StatRowData> }) {
    this.data = { items: data.items ?? [{ value: '', label: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderStatRow(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-stat-row';

    const list = createRepeatableList<StatData>({
      items: this.data.items,
      createItem: () => ({ value: '', label: '' }),
      renderItem: renderStatItem,
      onChange: () => this.refresh(),
      addLabel: 'Add stat',
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): StatRowData {
    return { items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: StatRowData): boolean {
    return savedData.items.length > 0;
  }
}
