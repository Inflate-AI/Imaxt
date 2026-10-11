import { type DeltaData, renderDelta } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

function parseValue(raw: string): string | number {
  const trimmed = raw.trim();
  if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed);
  return raw;
}

export class DeltaTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Delta' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: DeltaData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<DeltaData> }) {
    this.data = {
      label: data.label ?? '',
      from: data.from ?? '',
      to: data.to ?? '',
      unit: data.unit,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderDelta(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-delta';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label';
    labelInput.dataset.field = 'label';
    labelInput.value = this.data.label;
    labelInput.addEventListener('input', () => {
      this.data.label = labelInput.value;
      this.refresh();
    });

    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.placeholder = 'From';
    fromInput.dataset.field = 'from';
    fromInput.value = String(this.data.from);
    fromInput.addEventListener('input', () => {
      this.data.from = parseValue(fromInput.value);
      this.refresh();
    });

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.placeholder = 'To';
    toInput.dataset.field = 'to';
    toInput.value = String(this.data.to);
    toInput.addEventListener('input', () => {
      this.data.to = parseValue(toInput.value);
      this.refresh();
    });

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.placeholder = 'Unit';
    unitInput.dataset.field = 'unit';
    unitInput.value = this.data.unit ?? '';
    unitInput.addEventListener('input', () => {
      this.data.unit = unitInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(labelInput, fromInput, toInput, unitInput, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): DeltaData {
    return { ...this.data };
  }

  validate(savedData: DeltaData): boolean {
    return savedData.label.trim().length > 0;
  }
}
