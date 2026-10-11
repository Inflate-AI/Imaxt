import { type ChangelogData, type ChangelogEntry, renderChangelog } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class ChangelogTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Changelog' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: ChangelogData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<ChangelogData> }) {
    this.data = { entries: data.entries ?? [{ version: '', items: [''] }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderChangelog(this.data);
  }

  private renderItem(entry: ChangelogEntry, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const versionInput = document.createElement('input');
    versionInput.type = 'text';
    versionInput.placeholder = 'Version';
    versionInput.value = entry.version;
    versionInput.addEventListener('input', () => {
      entry.version = versionInput.value;
      onChange();
    });

    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.placeholder = 'Date (optional)';
    dateInput.value = entry.date ?? '';
    dateInput.addEventListener('input', () => {
      entry.date = dateInput.value || undefined;
      onChange();
    });

    const itemsInput = document.createElement('textarea');
    itemsInput.placeholder = 'Items, one per line';
    itemsInput.value = entry.items.join('\n');
    itemsInput.addEventListener('input', () => {
      entry.items = itemsInput.value.split('\n').filter((line) => line.trim().length > 0);
      onChange();
    });

    row.append(versionInput, dateInput, itemsInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-changelog';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<ChangelogEntry>({
      items: this.data.entries,
      createItem: () => ({ version: '', items: [''] }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add version',
    });

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): ChangelogData {
    return { entries: this.data.entries.map((entry) => ({ ...entry, items: [...entry.items] })) };
  }

  validate(savedData: ChangelogData): boolean {
    return savedData.entries.length > 0;
  }
}
