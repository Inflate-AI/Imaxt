import { type MatrixData, renderMatrix } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

function syncShape(data: MatrixData) {
  data.cells = data.rows.map((_, rowIndex) =>
    Array.from(
      { length: data.cols.length },
      (_, colIndex) => data.cells[rowIndex]?.[colIndex] ?? 'no',
    ),
  );
}

export class MatrixTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.grid, title: 'Matrix' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: MatrixData;
  private preview: HTMLElement | null = null;
  private grid: HTMLElement | null = null;

  constructor({ data }: { data: Partial<MatrixData> }) {
    this.data = {
      rows: data.rows ?? ['Row 1'],
      cols: data.cols ?? ['Column 1'],
      cells: data.cells ?? [['no']],
      caption: data.caption,
    };
    syncShape(this.data);
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderMatrix(this.data);
    if (this.grid) {
      this.grid.replaceWith(this.renderGrid());
    }
  }

  private renderLabelList(values: string[], addLabel: string, onChange: () => void): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'imx-ej-list';
    const list = document.createElement('div');
    wrap.append(list);

    const addRow = (index: number) => {
      const row = document.createElement('div');
      row.className = 'imx-ej-item';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = values[index] ?? '';
      input.addEventListener('input', () => {
        values[index] = input.value;
        onChange();
      });
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'imx-ej-remove';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        values.splice(index, 1);
        onChange();
      });
      row.append(input, removeButton);
      list.append(row);
    };
    for (let index = 0; index < values.length; index++) addRow(index);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'imx-ej-add';
    addButton.textContent = addLabel;
    addButton.addEventListener('click', () => {
      values.push('');
      onChange();
    });
    wrap.append(addButton);
    return wrap;
  }

  private renderGrid(): HTMLElement {
    const grid = document.createElement('table');
    grid.className = 'imx-ej-matrix-grid';
    for (let rowIndex = 0; rowIndex < this.data.rows.length; rowIndex++) {
      const tr = document.createElement('tr');
      for (let colIndex = 0; colIndex < this.data.cols.length; colIndex++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'yes / no / partial';
        input.value = this.data.cells[rowIndex]?.[colIndex] ?? 'no';
        input.addEventListener('input', () => {
          const row = this.data.cells[rowIndex];
          if (row) row[colIndex] = input.value;
          if (this.preview) this.preview.innerHTML = renderMatrix(this.data);
        });
        td.append(input);
        tr.append(td);
      }
      grid.append(tr);
    }
    this.grid = grid;
    return grid;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-matrix';

    const onListChange = () => {
      syncShape(this.data);
      this.refresh();
    };

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.placeholder = 'Caption';
    captionInput.value = this.data.caption ?? '';
    captionInput.addEventListener('input', () => {
      this.data.caption = captionInput.value || undefined;
      this.refresh();
    });

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(
      this.renderLabelList(this.data.rows, 'Add row', onListChange),
      this.renderLabelList(this.data.cols, 'Add column', onListChange),
      this.renderGrid(),
      captionInput,
      this.preview,
    );
    this.refresh();
    return wrapper;
  }

  save(): MatrixData {
    return {
      ...this.data,
      rows: [...this.data.rows],
      cols: [...this.data.cols],
      cells: this.data.cells.map((row) => [...row]),
    };
  }

  validate(savedData: MatrixData): boolean {
    if (savedData.cells.length !== savedData.rows.length) return false;
    return savedData.cells.every((row) => row.length === savedData.cols.length);
  }
}
