import { type RedactedData, renderRedacted } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class RedactedTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Redacted' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: RedactedData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<RedactedData> }) {
    this.data = { html: data.html ?? '', revealLabel: data.revealLabel };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderRedacted(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-redacted';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Reveal label (optional)';
    labelInput.value = this.data.revealLabel ?? '';
    labelInput.addEventListener('input', () => {
      this.data.revealLabel = labelInput.value || undefined;
      this.refresh();
    });

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

    wrapper.append(labelInput, editable, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): RedactedData {
    return { ...this.data };
  }

  validate(savedData: RedactedData): boolean {
    return savedData.html.trim().length > 0;
  }
}
