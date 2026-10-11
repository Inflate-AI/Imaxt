import { type ErrorBoxData, renderErrorBox } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class ErrorBoxTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'ErrorBox' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: ErrorBoxData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<ErrorBoxData> }) {
    this.data = { title: data.title ?? '', message: data.message ?? '', stack: data.stack };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderErrorBox(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-errorbox';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title';
    titleInput.value = this.data.title;
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.value;
      this.refresh();
    });

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = 'Message';
    messageInput.value = this.data.message;
    messageInput.addEventListener('input', () => {
      this.data.message = messageInput.value;
      this.refresh();
    });

    const stackInput = document.createElement('textarea');
    stackInput.placeholder = 'Stack trace (optional)';
    stackInput.value = this.data.stack ?? '';
    stackInput.addEventListener('input', () => {
      this.data.stack = stackInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(titleInput, messageInput, stackInput, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): ErrorBoxData {
    return { ...this.data };
  }

  validate(savedData: ErrorBoxData): boolean {
    return savedData.title.trim().length > 0 && savedData.message.trim().length > 0;
  }
}
