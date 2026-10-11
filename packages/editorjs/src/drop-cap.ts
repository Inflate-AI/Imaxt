import { type DropCapData, renderDropCap } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class DropCapTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'DropCap' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: DropCapData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<DropCapData> }) {
    this.data = { html: data.html ?? '', tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderDropCap(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-dropcap';

    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    editable.className = 'imx-ej-field';
    editable.innerHTML = this.data.html;
    editable.addEventListener('input', () => {
      this.data.html = editable.innerHTML;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(editable, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): DropCapData {
    return { ...this.data };
  }

  validate(savedData: DropCapData): boolean {
    return savedData.html.trim().length > 0;
  }
}
