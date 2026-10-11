import { renderTerminal, type TerminalData, type TerminalLine } from '@inflate-ai/imaxt-core';
import { createRepeatableList, TOOLBOX_ICON } from './shared.ts';

export class TerminalTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.text, title: 'Terminal' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: TerminalData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<TerminalData> }) {
    this.data = { lines: data.lines ?? [{ command: '' }], title: data.title };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderTerminal(this.data);
  }

  private renderItem(line: TerminalLine, onChange: () => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';

    const commandInput = document.createElement('input');
    commandInput.type = 'text';
    commandInput.placeholder = 'Command (leave blank for output-only)';
    commandInput.value = line.command ?? '';
    commandInput.addEventListener('input', () => {
      line.command = commandInput.value || undefined;
      onChange();
    });

    const outputInput = document.createElement('input');
    outputInput.type = 'text';
    outputInput.placeholder = 'Output';
    outputInput.value = line.output ?? '';
    outputInput.addEventListener('input', () => {
      line.output = outputInput.value || undefined;
      onChange();
    });

    row.append(commandInput, outputInput);
    return row;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-terminal';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Title (optional)';
    titleInput.value = this.data.title ?? '';
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    const list = createRepeatableList<TerminalLine>({
      items: this.data.lines,
      createItem: () => ({ command: '' }),
      renderItem: (item, onChange) => this.renderItem(item, onChange),
      onChange: () => this.refresh(),
      addLabel: 'Add line',
    });

    wrapper.append(titleInput, list, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): TerminalData {
    return { ...this.data, lines: this.data.lines.map((line) => ({ ...line })) };
  }

  validate(savedData: TerminalData): boolean {
    return savedData.lines.length > 0;
  }
}
