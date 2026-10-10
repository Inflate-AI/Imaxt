import { type CurvedTextData, renderCurvedText } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class CurvedTextTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Curved text' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: CurvedTextData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<CurvedTextData> }) {
    this.data = {
      text: data.text ?? '',
      shape: data.shape ?? 'arc',
      mark: data.mark ?? '',
      tone: data.tone,
      spin: data.spin ?? false,
      decorative: data.decorative ?? false,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderCurvedText(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-curved-text';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Text';
    textInput.value = this.data.text;
    textInput.addEventListener('input', () => {
      this.data.text = textInput.value;
      this.refresh();
    });

    const shapeSelect = document.createElement('select');
    for (const shape of ['arc', 'wave', 'circle'] as const) {
      const option = document.createElement('option');
      option.value = shape;
      option.textContent = shape;
      option.selected = shape === this.data.shape;
      shapeSelect.append(option);
    }
    shapeSelect.addEventListener('change', () => {
      this.data.shape = shapeSelect.value as CurvedTextData['shape'];
      this.refresh();
    });

    const markInput = document.createElement('input');
    markInput.type = 'text';
    markInput.placeholder = 'Mark (circle only)';
    markInput.value = this.data.mark ?? '';
    markInput.addEventListener('input', () => {
      this.data.mark = markInput.value;
      this.refresh();
    });

    const spinLabel = document.createElement('label');
    const spinCheckbox = document.createElement('input');
    spinCheckbox.type = 'checkbox';
    spinCheckbox.checked = Boolean(this.data.spin);
    spinCheckbox.addEventListener('change', () => {
      this.data.spin = spinCheckbox.checked;
      this.refresh();
    });
    spinLabel.append(spinCheckbox, document.createTextNode('Spin'));

    const decorativeLabel = document.createElement('label');
    const decorativeCheckbox = document.createElement('input');
    decorativeCheckbox.type = 'checkbox';
    decorativeCheckbox.checked = Boolean(this.data.decorative);
    decorativeCheckbox.addEventListener('change', () => {
      this.data.decorative = decorativeCheckbox.checked;
      this.refresh();
    });
    decorativeLabel.append(decorativeCheckbox, document.createTextNode('Decorative'));

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(textInput, shapeSelect, markInput, spinLabel, decorativeLabel, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): CurvedTextData {
    return { ...this.data };
  }

  validate(savedData: CurvedTextData): boolean {
    return savedData.text.trim().length > 0;
  }
}
