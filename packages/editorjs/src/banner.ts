import { type BannerData, renderBanner } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class BannerTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Banner' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: BannerData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<BannerData> }) {
    this.data = { text: data.text ?? '', tone: data.tone };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderBanner(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-banner';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Text';
    textInput.value = this.data.text;
    textInput.addEventListener('input', () => {
      this.data.text = textInput.value;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(textInput, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): BannerData {
    return { ...this.data };
  }

  validate(savedData: BannerData): boolean {
    return savedData.text.trim().length > 0;
  }
}
