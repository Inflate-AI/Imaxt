import { renderSparkline, type SparklineData } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

function parseValues(raw: string): number[] {
  return raw
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((value) => !Number.isNaN(value));
}

export class SparklineTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Sparkline' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: SparklineData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<SparklineData> }) {
    this.data = { values: data.values ?? [], label: data.label };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderSparkline(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-sparkline';

    const valuesInput = document.createElement('input');
    valuesInput.type = 'text';
    valuesInput.placeholder = 'Values, comma-separated';
    valuesInput.value = this.data.values.join(', ');
    valuesInput.addEventListener('input', () => {
      this.data.values = parseValues(valuesInput.value);
      this.refresh();
    });

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label';
    labelInput.value = this.data.label ?? '';
    labelInput.addEventListener('input', () => {
      this.data.label = labelInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(valuesInput, labelInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): SparklineData {
    return { ...this.data, values: [...this.data.values] };
  }

  validate(savedData: SparklineData): boolean {
    return savedData.values.length > 0;
  }
}
