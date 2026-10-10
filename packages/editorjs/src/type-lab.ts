import { attachTypeLab, renderTypeLab, type TypeLabData } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class TypeLabTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.media, title: 'Type lab' };
  }

  data: TypeLabData;
  private wrapper: HTMLElement | null = null;

  constructor({ data }: { data: Partial<TypeLabData> }) {
    this.data = { sample: data.sample ?? '', family: data.family };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.innerHTML = renderTypeLab(this.data);
    attachTypeLab(this.wrapper);
    return this.wrapper;
  }

  save(): TypeLabData {
    const lab = this.wrapper?.querySelector<HTMLElement>('.imx-typelab');
    const input = this.wrapper?.querySelector<HTMLInputElement>('.imx-tl-text-input');
    return {
      sample: input?.value ?? this.data.sample,
      family: (lab?.dataset.family as TypeLabData['family']) ?? this.data.family,
    };
  }

  validate(savedData: TypeLabData): boolean {
    return (savedData.sample ?? '').trim().length > 0;
  }
}
