import { type GlossaryData, type GlossaryItem, renderGlossary } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class GlossaryTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'Glossary' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: GlossaryData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<GlossaryData> }) {
    this.data = { items: data.items ?? [{ term: '', definition: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderGlossary(this.data);
  }

  private renderItem(item: GlossaryItem, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const termInput = document.createElement('input');
    termInput.type = 'text';
    termInput.placeholder = 'Term';
    termInput.value = item.term;
    termInput.addEventListener('input', () => {
      item.term = termInput.value;
      onChange();
    });

    const definitionInput = document.createElement('textarea');
    definitionInput.placeholder = 'Definition';
    definitionInput.value = item.definition;
    definitionInput.addEventListener('input', () => {
      item.definition = definitionInput.value;
      onChange();
    });

    row.append(termInput, definitionInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-glossary';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<GlossaryItem>({
      items: this.data.items,
      createItem: () => ({ term: '', definition: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add term',
    });

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): GlossaryData {
    return { items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: GlossaryData): boolean {
    return savedData.items.length > 0;
  }
}
