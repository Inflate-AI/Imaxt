import { type MarqueeData, renderMarquee } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

export class MarqueeTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Marquee' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: MarqueeData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<MarqueeData> }) {
    this.data = {
      words: data.words ?? [],
      tone: data.tone,
      bleed: data.bleed ?? false,
      seconds: data.seconds,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderMarquee(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-marquee';

    const wordsInput = document.createElement('input');
    wordsInput.type = 'text';
    wordsInput.placeholder = 'Words, comma separated';
    wordsInput.value = this.data.words.join(', ');
    wordsInput.addEventListener('input', () => {
      this.data.words = wordsInput.value
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(wordsInput, this.preview);
    this.refresh();
    return wrapper;
  }

  renderSettings(): HTMLElement {
    return createTonePicker(this.data.tone, (tone) => {
      this.data.tone = tone;
      this.refresh();
    });
  }

  save(): MarqueeData {
    return { ...this.data, words: [...this.data.words] };
  }

  validate(savedData: MarqueeData): boolean {
    return savedData.words.length > 0;
  }
}
