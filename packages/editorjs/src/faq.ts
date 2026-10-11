import { type FaqData, type FaqItem, renderFaq } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class FaqTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.list, title: 'FAQ' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: FaqData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<FaqData> }) {
    this.data = { items: data.items ?? [{ q: '', a: '' }] };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderFaq(this.data);
  }

  private renderItem(item: FaqItem, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const qInput = document.createElement('input');
    qInput.type = 'text';
    qInput.placeholder = 'Question';
    qInput.value = item.q;
    qInput.addEventListener('input', () => {
      item.q = qInput.value;
      onChange();
    });

    const aInput = document.createElement('textarea');
    aInput.placeholder = 'Answer';
    aInput.value = item.a;
    aInput.addEventListener('input', () => {
      item.a = aInput.value;
      onChange();
    });

    row.append(qInput, aInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-faq';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<FaqItem>({
      items: this.data.items,
      createItem: () => ({ q: '', a: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add question',
    });

    wrapper.append(list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): FaqData {
    return { items: this.data.items.map((item) => ({ ...item })) };
  }

  validate(savedData: FaqData): boolean {
    return savedData.items.length > 0;
  }
}
