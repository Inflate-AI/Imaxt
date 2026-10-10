import { type PullQuoteData, renderPullQuote } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class PullQuoteTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.quote, title: 'Pull quote' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: PullQuoteData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<PullQuoteData> }) {
    this.data = { html: data.html ?? '', by: data.by ?? '' };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderPullQuote(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-pull-quote';

    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    editable.className = 'imx-ej-field';
    editable.innerHTML = this.data.html;
    editable.addEventListener('input', () => {
      this.data.html = editable.innerHTML;
      this.refresh();
    });

    const byInput = document.createElement('input');
    byInput.type = 'text';
    byInput.placeholder = 'Attribution (optional)';
    byInput.value = this.data.by ?? '';
    byInput.addEventListener('input', () => {
      this.data.by = byInput.value;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(editable, byInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): PullQuoteData {
    return { ...this.data };
  }

  validate(savedData: PullQuoteData): boolean {
    return savedData.html.trim().length > 0;
  }
}
