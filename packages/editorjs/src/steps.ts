import { renderSteps, type StepData, type StepsData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

function renderStepItem(item: StepData, onChange: () => void, onRemove: () => void): HTMLElement {
  const row = document.createElement('div');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Title';
  titleInput.value = item.title;
  titleInput.addEventListener('input', () => {
    item.title = titleInput.value;
    onChange();
  });

  const editable = document.createElement('div');
  editable.contentEditable = 'true';
  editable.innerHTML = item.html;
  editable.addEventListener('input', () => {
    item.html = editable.innerHTML;
    onChange();
  });

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'imx-ej-remove';
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', onRemove);

  row.append(titleInput, editable, removeButton);
  return row;
}

export class StepsTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Steps' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: StepsData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<StepsData> }) {
    this.data = { items: data.items ?? [{ title: '', html: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderSteps(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-steps';

    const list = createRepeatableList<StepData>({
      items: this.data.items,
      createItem: () => ({ title: '', html: '' }),
      renderItem: renderStepItem,
      onChange: () => this.refresh(),
      addLabel: 'Add step',
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): StepsData {
    return { items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: StepsData): boolean {
    return savedData.items.length > 0;
  }
}
