import { type FunnelData, type FunnelStage, renderFunnel } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class FunnelTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Funnel' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: FunnelData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<FunnelData> }) {
    this.data = {
      stages: data.stages ?? [{ label: '', value: 0 }],
      unit: data.unit,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderFunnel(this.data);
  }

  private renderItem(stage: FunnelStage, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Stage';
    labelInput.value = stage.label;
    labelInput.addEventListener('input', () => {
      stage.label = labelInput.value;
      onChange();
    });

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.value = String(stage.value);
    valueInput.addEventListener('input', () => {
      stage.value = Number(valueInput.value);
      onChange();
    });

    row.append(labelInput, valueInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-funnel';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<FunnelStage>({
      items: this.data.stages,
      createItem: () => ({ label: '', value: 0 }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add stage',
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

  save(): FunnelData {
    return { ...this.data, stages: this.data.stages.map((stage) => ({ ...stage })) };
  }

  validate(savedData: FunnelData): boolean {
    return savedData.stages.length > 0;
  }
}
