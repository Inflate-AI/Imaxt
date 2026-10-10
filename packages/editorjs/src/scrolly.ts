import { type BeatData, renderScrolly, type ScrollyData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

function renderBeatItem(item: BeatData, onChange: () => void, onRemove: () => void): HTMLElement {
  const row = document.createElement('div');

  const stageInput = document.createElement('input');
  stageInput.type = 'text';
  stageInput.placeholder = 'Stage';
  stageInput.value = item.stage;
  stageInput.addEventListener('input', () => {
    item.stage = stageInput.value;
    onChange();
  });

  const subInput = document.createElement('input');
  subInput.type = 'text';
  subInput.placeholder = 'Sub (optional)';
  subInput.value = item.sub ?? '';
  subInput.addEventListener('input', () => {
    item.sub = subInput.value;
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

  row.append(stageInput, subInput, editable, removeButton);
  return row;
}

export class ScrollyTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Scrolly' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: ScrollyData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<ScrollyData> }) {
    this.data = { items: data.items ?? [{ stage: '', html: '' }], tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderScrolly(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-scrolly';

    const list = createRepeatableList<BeatData>({
      items: this.data.items,
      createItem: () => ({ stage: '', html: '' }),
      renderItem: renderBeatItem,
      onChange: () => this.refresh(),
      addLabel: 'Add beat',
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): ScrollyData {
    return { ...this.data, items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: ScrollyData): boolean {
    return savedData.items.length > 0;
  }
}
