import { renderVersus, type VersusData, type VersusSide } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class VersusTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.chart, title: 'Versus' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: VersusData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<VersusData> }) {
    const sides = data.sides ?? [
      { label: '', html: '' },
      { label: '', html: '' },
    ];
    this.data = {
      sides: [sides[0] ?? { label: '', html: '' }, sides[1] ?? { label: '', html: '' }],
      vsLabel: data.vsLabel,
      tone: data.tone,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderVersus(this.data);
  }

  private renderSide(side: VersusSide, index: 0 | 1): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'imx-ej-item';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label';
    labelInput.value = side.label;
    labelInput.addEventListener('input', () => {
      this.data.sides[index].label = labelInput.value;
      this.refresh();
    });

    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    editable.className = 'imx-ej-field';
    editable.innerHTML = side.html;
    editable.addEventListener('input', () => {
      this.data.sides[index].html = editable.innerHTML;
      this.refresh();
    });

    wrap.append(labelInput, editable);
    return wrap;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-versus';

    const vsLabelInput = document.createElement('input');
    vsLabelInput.type = 'text';
    vsLabelInput.placeholder = 'VS label (defaults to VS)';
    vsLabelInput.value = this.data.vsLabel ?? '';
    vsLabelInput.addEventListener('input', () => {
      this.data.vsLabel = vsLabelInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(
      this.renderSide(this.data.sides[0], 0),
      vsLabelInput,
      this.renderSide(this.data.sides[1], 1),
      this.preview,
    );
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): VersusData {
    return {
      ...this.data,
      sides: [{ ...this.data.sides[0] }, { ...this.data.sides[1] }],
    };
  }

  validate(savedData: VersusData): boolean {
    return savedData.sides.length === 2;
  }
}
