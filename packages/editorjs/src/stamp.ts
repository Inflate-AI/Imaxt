import { renderStamp, type StampData } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class StampTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Stamp' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: StampData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<StampData> }) {
    this.data = { text: data.text ?? '', angle: data.angle, tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderStamp(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-stamp';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Text';
    textInput.value = this.data.text;
    textInput.addEventListener('input', () => {
      this.data.text = textInput.value;
      this.refresh();
    });

    const angleInput = document.createElement('input');
    angleInput.type = 'number';
    angleInput.placeholder = 'Angle in degrees (optional)';
    angleInput.value = this.data.angle === undefined ? '' : String(this.data.angle);
    angleInput.addEventListener('input', () => {
      this.data.angle = angleInput.value === '' ? undefined : Number(angleInput.value);
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(textInput, angleInput, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): StampData {
    return { ...this.data };
  }

  validate(savedData: StampData): boolean {
    return savedData.text.trim().length > 0;
  }
}
