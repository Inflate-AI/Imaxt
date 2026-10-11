import { type FootnoteData, renderFootnote } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class FootnoteTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Footnote' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: FootnoteData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<FootnoteData> }) {
    this.data = { html: data.html ?? '', marker: data.marker };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderFootnote(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-footnote';

    const markerInput = document.createElement('input');
    markerInput.type = 'text';
    markerInput.placeholder = 'Marker (defaults to *)';
    markerInput.value = this.data.marker ?? '';
    markerInput.addEventListener('input', () => {
      this.data.marker = markerInput.value || undefined;
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

    wrapper.append(markerInput, editable, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): FootnoteData {
    return { ...this.data };
  }

  validate(savedData: FootnoteData): boolean {
    return savedData.html.trim().length > 0;
  }
}
