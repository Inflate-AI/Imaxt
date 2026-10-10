import { renderStatement, type StatementData } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class StatementTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Statement' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return { html: { b: true, strong: true, i: true, em: true, br: true } };
  }

  data: StatementData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<StatementData> }) {
    this.data = { html: data.html ?? '', tone: data.tone ?? 'ink', align: data.align ?? 'left' };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderStatement(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-statement';

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
    const wrap = document.createElement('div');
    const align = document.createElement('button');
    align.type = 'button';
    align.textContent = this.data.align === 'center' ? 'Center aligned' : 'Left aligned';
    align.addEventListener('click', () => {
      this.data.align = this.data.align === 'center' ? 'left' : 'center';
      align.textContent = this.data.align === 'center' ? 'Center aligned' : 'Left aligned';
      this.refresh();
    });
    wrap.append(
      align,
      createTonePicker(this.data.tone, (tone) => {
        this.data.tone = tone;
        this.refresh();
      }),
    );
    return wrap;
  }

  save(): StatementData {
    return { ...this.data };
  }

  validate(savedData: StatementData): boolean {
    return savedData.html.trim().length > 0;
  }
}
