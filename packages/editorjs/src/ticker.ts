import { renderTicker, type TickerData } from '@inflate-ai/imaxt-core';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class TickerTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Ticker' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: TickerData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<TickerData> }) {
    this.data = { phrases: data.phrases ?? [''], seconds: data.seconds, tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderTicker(this.data);
  }

  private renderItem(phrase: string, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Phrase';
    input.value = phrase;
    input.addEventListener('input', () => {
      const index = this.data.phrases.indexOf(phrase);
      this.data.phrases[index] = input.value;
      onChange();
    });
    row.append(input);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-ticker';

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<string>({
      items: this.data.phrases,
      createItem: () => '',
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add phrase',
    });

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

  save(): TickerData {
    return { ...this.data, phrases: [...this.data.phrases] };
  }

  validate(savedData: TickerData): boolean {
    return savedData.phrases.length > 0;
  }
}
