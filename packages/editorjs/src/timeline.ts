import { type EventData, renderTimeline, type TimelineData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

function renderEventItem(item: EventData, onChange: () => void, onRemove: () => void): HTMLElement {
  const row = document.createElement('div');

  const dateInput = document.createElement('input');
  dateInput.type = 'text';
  dateInput.placeholder = 'Date';
  dateInput.value = item.date;
  dateInput.addEventListener('input', () => {
    item.date = dateInput.value;
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

  row.append(dateInput, titleInput, editable, removeButton);
  return row;
}

export class TimelineTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Timeline' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: TimelineData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<TimelineData> }) {
    this.data = { items: data.items ?? [{ date: '', title: '', html: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderTimeline(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-timeline';

    const list = createRepeatableList<EventData>({
      items: this.data.items,
      createItem: () => ({ date: '', title: '', html: '' }),
      renderItem: renderEventItem,
      onChange: () => this.refresh(),
      addLabel: 'Add event',
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): TimelineData {
    return { items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: TimelineData): boolean {
    return savedData.items.length > 0;
  }
}
