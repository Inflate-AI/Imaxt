import { type DiffData, renderDiff } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class DiffTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Diff' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: DiffData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<DiffData> }) {
    this.data = { before: data.before ?? '', after: data.after ?? '', lang: data.lang };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderDiff(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-diff';

    const beforeInput = document.createElement('textarea');
    beforeInput.placeholder = 'Before';
    beforeInput.dataset.field = 'before';
    beforeInput.value = this.data.before;
    beforeInput.addEventListener('input', () => {
      this.data.before = beforeInput.value;
      this.refresh();
    });

    const afterInput = document.createElement('textarea');
    afterInput.placeholder = 'After';
    afterInput.dataset.field = 'after';
    afterInput.value = this.data.after;
    afterInput.addEventListener('input', () => {
      this.data.after = afterInput.value;
      this.refresh();
    });

    const langInput = document.createElement('input');
    langInput.type = 'text';
    langInput.placeholder = 'Language (optional)';
    langInput.value = this.data.lang ?? '';
    langInput.addEventListener('input', () => {
      this.data.lang = langInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(beforeInput, afterInput, langInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): DiffData {
    return { ...this.data };
  }

  validate(_savedData: DiffData): boolean {
    return true;
  }
}
