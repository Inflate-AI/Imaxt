import { type FormulaData, renderFormula } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class FormulaTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Formula' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: FormulaData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<FormulaData> }) {
    this.data = { tex: data.tex ?? '', display: data.display, caption: data.caption };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderFormula(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-formula';

    const texInput = document.createElement('input');
    texInput.type = 'text';
    texInput.placeholder = 'LaTeX, e.g. E=mc^2';
    texInput.dataset.field = 'tex';
    texInput.value = this.data.tex;
    texInput.addEventListener('input', () => {
      this.data.tex = texInput.value;
      this.refresh();
    });

    const displayCheckbox = document.createElement('input');
    displayCheckbox.type = 'checkbox';
    displayCheckbox.checked = Boolean(this.data.display);
    displayCheckbox.addEventListener('change', () => {
      this.data.display = displayCheckbox.checked || undefined;
      this.refresh();
    });

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Caption (optional)';
    captionInput.value = this.data.caption ?? '';
    captionInput.addEventListener('input', () => {
      this.data.caption = captionInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(texInput, displayCheckbox, captionInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): FormulaData {
    return { ...this.data };
  }

  validate(savedData: FormulaData): boolean {
    return savedData.tex.trim().length > 0;
  }
}
