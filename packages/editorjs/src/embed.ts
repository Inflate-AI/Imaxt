import { type EmbedData, renderEmbed } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class EmbedTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.media, title: 'Embed' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: EmbedData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<EmbedData> }) {
    this.data = { url: data.url ?? '', caption: data.caption };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderEmbed(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-embed';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'URL';
    urlInput.value = this.data.url;
    urlInput.addEventListener('input', () => {
      this.data.url = urlInput.value;
      this.refresh();
    });

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Caption (optional)';
    captionInput.value = this.data.caption ?? '';
    captionInput.addEventListener('input', () => {
      this.data.caption = captionInput.value;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(urlInput, captionInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): EmbedData {
    return { ...this.data };
  }

  validate(savedData: EmbedData): boolean {
    return savedData.url.trim().length > 0;
  }
}
