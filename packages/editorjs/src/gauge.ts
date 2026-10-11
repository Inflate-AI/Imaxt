import { type GaugeData, renderGauge } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class GaugeTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Gauge' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: GaugeData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<GaugeData> }) {
    this.data = {
      value: data.value ?? 0,
      max: data.max ?? 100,
      label: data.label,
      unit: data.unit,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderGauge(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-gauge';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label';
    labelInput.value = this.data.label ?? '';
    labelInput.addEventListener('input', () => {
      this.data.label = labelInput.value || undefined;
      this.refresh();
    });

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.dataset.field = 'value';
    valueInput.value = String(this.data.value);
    valueInput.addEventListener('input', () => {
      this.data.value = Number(valueInput.value);
      this.refresh();
    });

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.dataset.field = 'max';
    maxInput.value = String(this.data.max);
    maxInput.addEventListener('input', () => {
      this.data.max = Number(maxInput.value);
      this.refresh();
    });

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.placeholder = 'Unit';
    unitInput.value = this.data.unit ?? '';
    unitInput.addEventListener('input', () => {
      this.data.unit = unitInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(labelInput, valueInput, maxInput, unitInput, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): GaugeData {
    return { ...this.data };
  }

  validate(savedData: GaugeData): boolean {
    return savedData.max > 0;
  }
}
