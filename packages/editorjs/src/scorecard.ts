import { renderScorecard, type ScorecardData, type ScorecardItem } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class ScorecardTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.grid, title: 'Scorecard' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: ScorecardData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<ScorecardData> }) {
    this.data = { items: data.items ?? [{ label: '', value: '' }], tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderScorecard(this.data);
  }

  private renderItem(item: ScorecardItem, onChange: () => void): HTMLElement {
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
    valueInput.value = String(item.value);
    valueInput.addEventListener('input', () => {
      item.value = valueInput.value;
      onChange();
    });

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.placeholder = 'Unit';
    unitInput.value = item.unit ?? '';
    unitInput.addEventListener('input', () => {
      item.unit = unitInput.value || undefined;
      onChange();
    });

    const deltaInput = document.createElement('input');
    deltaInput.type = 'text';
    deltaInput.placeholder = 'Delta';
    deltaInput.value = item.delta ?? '';
    deltaInput.addEventListener('input', () => {
      item.delta = deltaInput.value || undefined;
      onChange();
    });

    row.append(labelInput, valueInput, unitInput, deltaInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-scorecard';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<ScorecardItem>({
      items: this.data.items,
      createItem: () => ({ label: '', value: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add metric',
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

  save(): ScorecardData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: ScorecardData): boolean {
    return savedData.items.length > 0;
  }
}
