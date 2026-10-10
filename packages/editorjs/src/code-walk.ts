import { type CodeWalkData, type CodeWalkStep, renderCodeWalk } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

function renderStepItem(
  item: CodeWalkStep,
  onChange: () => void,
  onRemove: () => void,
): HTMLElement {
  const row = document.createElement('div');

  const linesInput = document.createElement('input');
  linesInput.type = 'text';
  linesInput.placeholder = 'Lines, e.g. 2-3';
  linesInput.value = item.lines;
  linesInput.addEventListener('input', () => {
    item.lines = linesInput.value;
    onChange();
  });

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Title';
  titleInput.value = item.title;
  titleInput.addEventListener('input', () => {
    item.title = titleInput.value;
    onChange();
  });

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Explanation (optional)';
  textInput.value = item.text ?? '';
  textInput.addEventListener('input', () => {
    item.text = textInput.value;
    onChange();
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'imx-ej-remove';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', onRemove);

  row.append(linesInput, titleInput, textInput, removeButton);
  return row;
}

export class CodeWalkTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Code walk' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: CodeWalkData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<CodeWalkData> }) {
    this.data = { code: data.code ?? '', steps: data.steps ?? [{ lines: '1', title: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderCodeWalk(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-code-walk';

    const codeArea = document.createElement('textarea');
    codeArea.placeholder = 'Code sample';
    codeArea.value = this.data.code;
    codeArea.addEventListener('input', () => {
      this.data.code = codeArea.value;
      this.refresh();
    });

    const list = createRepeatableList<CodeWalkStep>({
      items: this.data.steps,
      createItem: () => ({ lines: '1', title: '' }),
      renderItem: renderStepItem,
      onChange: () => this.refresh(),
      addLabel: 'Add step',
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(codeArea, list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): CodeWalkData {
    return { code: this.data.code, steps: this.data.steps.map((step) => ({ ...step })) };
  }

  validate(savedData: CodeWalkData): boolean {
    return savedData.code.trim().length > 0 && savedData.steps.length > 0;
  }
}
