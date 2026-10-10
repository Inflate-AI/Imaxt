import { renderSidenote, type SidenoteData } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class SidenoteTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Sidenote' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: SidenoteData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<SidenoteData> }) {
    this.data = { html: data.html ?? '', label: data.label ?? '' };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderSidenote(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-sidenote';

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Label (defaults to "Note")';
    labelInput.value = this.data.label ?? '';
    labelInput.addEventListener('input', () => {
      this.data.label = labelInput.value;
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

  save(): SidenoteData {
    return { ...this.data };
  }

  validate(savedData: SidenoteData): boolean {
    return savedData.html.trim().length > 0;
  }
}
