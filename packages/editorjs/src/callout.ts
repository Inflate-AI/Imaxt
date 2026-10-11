import { type CalloutData, type CalloutKind, renderCallout } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

const KINDS: CalloutKind[] = ['note', 'warning', 'danger', 'tip'];

export class CalloutTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Callout' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: CalloutData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<CalloutData> }) {
    this.data = { html: data.html ?? '', kind: data.kind, title: data.title };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderCallout(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-callout';

    const kindSelect = document.createElement('select');
    for (const kind of KINDS) {
      const option = document.createElement('option');
      option.value = kind;
      option.textContent = kind;
      if (kind === (this.data.kind ?? 'note')) option.selected = true;
      kindSelect.append(option);
    }
    kindSelect.addEventListener('change', () => {
      this.data.kind = kindSelect.value as CalloutKind;
      this.refresh();
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title (optional)';
    titleInput.value = this.data.title ?? '';
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.value || undefined;
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

    wrapper.append(kindSelect, titleInput, editable, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): CalloutData {
    return { ...this.data };
  }

  validate(savedData: CalloutData): boolean {
    return savedData.html.trim().length > 0;
  }
}
